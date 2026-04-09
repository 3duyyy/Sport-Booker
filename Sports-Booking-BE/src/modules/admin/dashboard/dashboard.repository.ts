import { Prisma } from '../../../../generated/prisma'
import { prisma } from '../../../shared/prisma/client'
import { toNumber } from '../../../shared/utils/utils'

type DashboardActivityType = 'success' | 'neutral' | 'danger' | 'primary'

export interface DashboardActivityEvent {
  title: string
  description: string
  type: DashboardActivityType
  occurredAt: Date
}

interface GetTopFacilitiesParams {
  page: number
  limit: number
  search?: string
}

interface TopFacilityRowRaw {
  id: number
  name: string
  ownerName: string
  sportName: string
  district: string | null
  city: string | null
  bookingCount: bigint | number | null
  revenue: string | number | null
  rating: string | number | null
  thumbnail: string | null
}

const buildLocation = (district: string | null, city: string | null): string => {
  return [district, city].filter(Boolean).join(', ') || 'Chưa cập nhật'
}

export class AdminDashboardRepository {
  static async getSummary(currentFrom: Date, currentTo: Date, previousFrom: Date) {
    const [currentRevenueAgg, previousRevenueAgg, activeBookings, totalBookings, pendingFacilities, pendingRefunds] =
      await Promise.all([
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            status: 'success',
            type: 'payment',
            createdAt: {
              gte: currentFrom,
              lte: currentTo
            }
          }
        }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            status: 'success',
            type: 'payment',
            createdAt: {
              gte: previousFrom,
              lt: currentFrom
            }
          }
        }),
        prisma.booking.count({
          where: {
            status: { in: ['pending', 'confirmed'] }
          }
        }),
        prisma.booking.count(),
        prisma.facility.count({
          where: { status: 'pending_approve' }
        }),
        prisma.refundRequest.count({
          where: { status: 'pending' }
        })
      ])

    const totalRevenue = Number(currentRevenueAgg._sum.amount ?? 0)
    const previousRevenue = Number(previousRevenueAgg._sum.amount ?? 0)
    const occupancyRate = totalBookings > 0 ? Math.round((activeBookings / totalBookings) * 100) : 0

    return {
      totalRevenue,
      previousRevenue,
      activeBookings,
      occupancyRate,
      pendingFacilities,
      pendingRefunds
    }
  }

  static async getRevenueBySport(fromDate: Date, toDate: Date) {
    const [sports, transactions] = await Promise.all([
      prisma.sport.findMany({
        select: {
          id: true,
          name: true
        },
        orderBy: { name: 'asc' }
      }),
      prisma.transaction.findMany({
        where: {
          status: 'success',
          createdAt: {
            gte: fromDate,
            lte: toDate
          }
        },
        select: {
          amount: true,
          booking: {
            select: {
              field: {
                select: {
                  facility: {
                    select: {
                      sportId: true
                    }
                  }
                }
              }
            }
          }
        }
      })
    ])

    const revenueMap = new Map<number, number>()

    for (const tx of transactions) {
      const sportId = tx.booking.field.facility.sportId
      const prev = revenueMap.get(sportId) ?? 0
      revenueMap.set(sportId, prev + Number(tx.amount))
    }

    const rows = sports.map((sport) => ({
      sportId: sport.id,
      sportName: sport.name,
      revenue: revenueMap.get(sport.id) ?? 0
    }))

    const total = rows.reduce((sum, item) => sum + item.revenue, 0)

    return rows.map((row) => ({
      ...row,
      percent: total > 0 ? Math.round((row.revenue / total) * 100) : 0
    }))
  }

  static async getTopFacilities(params: GetTopFacilitiesParams) {
    const page = Math.max(1, Number(params.page) || 1)
    const limit = Math.min(100, Number(params.limit) || 10)
    const offset = (page - 1) * limit
    const keyword = params.search?.trim() ?? ''

    const searchSql = keyword ? Prisma.sql`AND f.name LIKE ${'%' + keyword + '%'}` : Prisma.empty

    const listSql = Prisma.sql`
      SELECT
        f.id,
        f.name,
        u.full_name AS ownerName,
        s.name AS sportName,
        f.district,
        f.city,
        COALESCE(bk.bookingCount, 0) AS bookingCount,
        COALESCE(rv.revenue, 0) AS revenue,
        COALESCE(rt.rating, 0) AS rating,
        COALESCE(img.thumbnail, '') AS thumbnail
      FROM facilities f
      INNER JOIN users u ON u.id = f.owner_id
      INNER JOIN sports s ON s.id = f.sport_id

      LEFT JOIN (
        SELECT
          fld.facility_id AS facilityId,
          COUNT(DISTINCT b.id) AS bookingCount
        FROM fields fld
        LEFT JOIN bookings b ON b.field_id = fld.id
        GROUP BY fld.facility_id
      ) bk ON bk.facilityId = f.id

      LEFT JOIN (
        SELECT
          fld.facility_id AS facilityId,
          COALESCE(SUM(
            CASE
              WHEN t.status = 'success' AND t.type = 'payment' THEN t.amount
              ELSE 0
            END
          ), 0) AS revenue
        FROM fields fld
        LEFT JOIN bookings b ON b.field_id = fld.id
        LEFT JOIN transactions t ON t.booking_id = b.id
        GROUP BY fld.facility_id
      ) rv ON rv.facilityId = f.id

      LEFT JOIN (
        SELECT
          r.facility_id AS facilityId,
          COALESCE(AVG(r.rating), 0) AS rating
        FROM reviews r
        GROUP BY r.facility_id
      ) rt ON rt.facilityId = f.id

      LEFT JOIN (
        SELECT
          fi.facility_id AS facilityId,
          MAX(CASE WHEN fi.is_thumbnail = 1 THEN fi.image_url END) AS thumbnail
        FROM facility_images fi
        GROUP BY fi.facility_id
      ) img ON img.facilityId = f.id

      WHERE f.status <> 'inactive'
      ${searchSql}
      ORDER BY revenue DESC, bookingCount DESC, rating DESC, f.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countSql = Prisma.sql`
      SELECT COUNT(*) AS total
      FROM facilities f
      WHERE f.status <> 'inactive'
      ${searchSql}
    `

    const [rows, countRows] = await prisma.$transaction([
      prisma.$queryRaw<TopFacilityRowRaw[]>(listSql),
      prisma.$queryRaw<Array<{ total: bigint | number }>>(countSql)
    ])

    const total = toNumber(countRows[0]?.total ?? 0)

    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      ownerName: row.ownerName,
      sportName: row.sportName,
      location: buildLocation(row.district, row.city),
      bookingCount: toNumber(row.bookingCount),
      revenue: toNumber(row.revenue),
      rating: Number(toNumber(row.rating).toFixed(1)),
      thumbnail: row.thumbnail || ''
    }))

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    }
  }

  static async getActivityEvents(limit: number): Promise<DashboardActivityEvent[]> {
    const [pendingFacilities, completedBookings, pendingRefunds, approvedRefunds] = await Promise.all([
      prisma.facility.findMany({
        where: { status: 'pending_approve' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          name: true,
          createdAt: true
        }
      }),
      prisma.booking.findMany({
        where: { status: 'completed' },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          updatedAt: true,
          field: {
            select: {
              facility: {
                select: { name: true }
              }
            }
          }
        }
      }),
      prisma.refundRequest.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          createdAt: true
        }
      }),
      prisma.refundRequest.findMany({
        where: { status: 'approved' },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          updatedAt: true
        }
      })
    ])

    const events: DashboardActivityEvent[] = [
      ...pendingFacilities.map((item) => ({
        title: 'Chủ sân mới đăng ký',
        description: item.name + ' vừa gửi yêu cầu duyệt cơ sở',
        type: 'success' as const,
        occurredAt: item.createdAt
      })),
      ...completedBookings.map((item) => ({
        title: 'Booking mới hoàn tất',
        description: item.field.facility.name + ' vừa hoàn thành một lượt đặt sân',
        type: 'neutral' as const,
        occurredAt: item.updatedAt
      })),
      ...pendingRefunds.map((item) => ({
        title: 'Khiếu nại từ khách hàng',
        description: 'Có một khiếu nại mới liên quan đến yêu cầu hoàn tiền',
        type: 'danger' as const,
        occurredAt: item.createdAt
      })),
      ...approvedRefunds.map((item) => ({
        title: 'Đã giải ngân hoàn tiền',
        description: 'Một yêu cầu refund đã được xử lý thành công',
        type: 'primary' as const,
        occurredAt: item.updatedAt
      }))
    ]

    return events
  }
}
