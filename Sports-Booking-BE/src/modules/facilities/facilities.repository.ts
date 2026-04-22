import { Prisma } from '../../../generated/prisma'
import { CreateFacilityDto, CreateFieldDto, FacilityQueryDto, PricingSlotDto } from '../../dtos/facilities.dto'
import { prisma } from '../../shared/prisma/client'
import { OwnerFacilitiesListParams } from '../../shared/types/owner'
import { toPagination } from '../../shared/utils/utils'

export class FacilitiesRepository {
  static async createFacility(ownerId: number, data: CreateFacilityDto) {
    const { images, utilityIds, ...facilityData } = data

    const uniqueUtilityIds = Array.isArray(utilityIds) ? [...new Set(utilityIds)] : []

    return prisma.facility.create({
      data: {
        ...facilityData,
        ownerId,
        ...(images?.length && {
          facilityImages: {
            create: images.map((url, index) => ({
              imageUrl: url,
              isThumbnail: index === 0
            }))
          }
        }),
        ...(uniqueUtilityIds.length
          ? {
              facilityUtilities: {
                create: uniqueUtilityIds.map((utilityId) => ({
                  utilityId
                }))
              }
            }
          : {})
      },
      include: {
        sport: true,
        facilityImages: true,
        facilityUtilities: { include: { utility: true } }
      }
    })
  }

  static async findFacilitiesByOwner(params: OwnerFacilitiesListParams) {
    const skip = (params.page - 1) * params.limit

    const where: Prisma.FacilityWhereInput = {
      ownerId: params.ownerId,
      ...(params.status ? { status: params.status } : {}),
      ...(params.keyword
        ? {
            OR: [
              { name: { contains: params.keyword } },
              { address: { contains: params.keyword } },
              { district: { contains: params.keyword } },
              { city: { contains: params.keyword } }
            ]
          }
        : {})
    }

    const [data, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          address: true,
          district: true,
          city: true,
          openTime: true,
          closeTime: true,
          sport: { select: { name: true } },
          fields: {
            select: {
              id: true,
              name: true,
              status: true,
              fieldPricings: {
                select: { pricePerHour: true },
                orderBy: { pricePerHour: 'asc' },
                take: 1
              }
            }
          }
        }
      }),
      prisma.facility.count({ where })
    ])

    return {
      data,
      pagination: toPagination(params.page, params.limit, total)
    }
  }

  static async findFacilityById(id: number) {
    return prisma.facility.findUnique({
      where: { id },
      include: {
        sport: true,
        facilityImages: { where: { isThumbnail: true } },
        fields: { include: { fieldPricings: true } }
      }
    })
  }

  static async createField(facilityId: number, data: CreateFieldDto) {
    return prisma.field.create({
      data: {
        facilityId,
        name: data.name,
        ...(data.description && { description: data.description })
      }
    })
  }

  static async findFieldById(id: number) {
    return prisma.field.findUnique({
      where: { id },
      include: { fieldPricings: true, facility: true }
    })
  }

  static async replaceFieldPricings(fieldId: number, pricings: PricingSlotDto[]) {
    await prisma.fieldPricing.deleteMany({ where: { fieldId } })

    return prisma.fieldPricing.createMany({
      data: pricings.map((p) => ({
        fieldId,
        startTime: p.startTime,
        endTime: p.endTime,
        pricePerHour: p.pricePerHour,
        isWeekend: p.isWeekend ?? false
      }))
    })
  }

  static async findPricingsByField(fieldId: number) {
    return prisma.fieldPricing.findMany({
      where: { fieldId },
      orderBy: [{ isWeekend: 'asc' }, { startTime: 'asc' }]
    })
  }

  static async getOwnerOverviewStatsRaw(ownerId: number) {
    const now = new Date()

    const startToday = new Date(now)
    startToday.setHours(0, 0, 0, 0)

    const endToday = new Date(now)
    endToday.setHours(23, 59, 59, 999)

    const startYesterday = new Date(startToday)
    startYesterday.setDate(startYesterday.getDate() - 1)

    const endYesterday = new Date(startToday)
    endYesterday.setMilliseconds(-1)

    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const startPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const current7dStart = new Date(now)
    current7dStart.setDate(current7dStart.getDate() - 6)
    current7dStart.setHours(0, 0, 0, 0)

    const previous7dStart = new Date(current7dStart)
    previous7dStart.setDate(previous7dStart.getDate() - 7)

    const previous7dEnd = new Date(current7dStart)
    previous7dEnd.setMilliseconds(-1)

    const bookingVisibleStatuses: Array<'pending' | 'confirmed' | 'completed'> = ['pending', 'confirmed', 'completed']

    const [
      todayBookings,
      yesterdayBookings,
      currentRevenueAgg,
      previousRevenueAgg,
      currentNewCustomersRows,
      previousNewCustomersRows,
      currentCompletedBookings,
      previousCompletedBookings
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          field: { facility: { ownerId } },
          startTime: { gte: startToday, lte: endToday },
          status: { in: bookingVisibleStatuses }
        }
      }),
      prisma.booking.count({
        where: {
          field: { facility: { ownerId } },
          startTime: { gte: startYesterday, lte: endYesterday },
          status: { in: bookingVisibleStatuses }
        }
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          booking: { field: { facility: { ownerId } } },
          status: 'success',
          type: 'payment',
          createdAt: { gte: startCurrentMonth, lt: startNextMonth }
        }
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          booking: { field: { facility: { ownerId } } },
          status: 'success',
          type: 'payment',
          createdAt: { gte: startPreviousMonth, lt: endPreviousMonth }
        }
      }),
      prisma.booking.groupBy({
        by: ['userId'],
        where: {
          field: { facility: { ownerId } },
          createdAt: { gte: current7dStart, lte: now },
          status: { notIn: ['cancelled', 'rejected'] }
        }
      }),
      prisma.booking.groupBy({
        by: ['userId'],
        where: {
          field: { facility: { ownerId } },
          createdAt: { gte: previous7dStart, lte: previous7dEnd },
          status: { notIn: ['cancelled', 'rejected'] }
        }
      }),
      prisma.booking.count({
        where: {
          field: { facility: { ownerId } },
          status: 'completed',
          updatedAt: { gte: startCurrentMonth, lt: startNextMonth }
        }
      }),
      prisma.booking.count({
        where: {
          field: { facility: { ownerId } },
          status: 'completed',
          updatedAt: { gte: startPreviousMonth, lt: endPreviousMonth }
        }
      })
    ])

    return {
      todayBookings,
      yesterdayBookings,
      monthlyRevenue: Number(currentRevenueAgg._sum.amount ?? 0),
      previousMonthRevenue: Number(previousRevenueAgg._sum.amount ?? 0),
      newCustomers7d: currentNewCustomersRows.length,
      previousNewCustomers7d: previousNewCustomersRows.length,
      completedBookingsMonth: currentCompletedBookings,
      previousCompletedBookingsMonth: previousCompletedBookings
    }
  }

  static async getOwnerOverviewRecentBookings(ownerId: number, start: Date, end: Date, params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit

    console.log('start', start)
    console.log('end', end)

    const where = {
      field: { facility: { ownerId } },
      createdAt: { gte: start, lte: end }
    }

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where: { field: { facility: { ownerId } }, startTime: { gte: start, lte: end } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: params.limit,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          user: { select: { fullName: true } },
          field: {
            select: {
              name: true,
              facility: {
                select: {
                  sport: { select: { name: true } }
                }
              }
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ])

    return {
      data,
      pagination: toPagination(params.page, params.limit, total)
    }
  }

  static async getOwnerOverviewTodaySchedule(ownerId: number, start: Date, end: Date, limit: number) {
    return prisma.booking.findMany({
      where: {
        field: { facility: { ownerId } },
        startTime: { gte: start, lte: end }
      },
      orderBy: { startTime: 'asc' },
      take: limit,
      select: {
        id: true,
        startTime: true,
        status: true,
        paymentStatus: true,
        user: { select: { fullName: true } },
        field: { select: { name: true } }
      }
    })
  }

  static async getOwnerCalendarFacilities(ownerId: number) {
    return prisma.facility.findMany({
      where: { ownerId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true
      }
    })
  }

  static async getOwnerCalendarBookings(ownerId: number, from: Date, to: Date) {
    return prisma.booking.findMany({
      where: {
        field: { facility: { ownerId } },
        startTime: { lt: to },
        endTime: { gt: from }
      },
      orderBy: { startTime: 'asc' },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        user: { select: { fullName: true } },
        field: {
          select: {
            name: true,
            facility: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
  }

  static async getOwnerCalendarMaintenanceFields(ownerId: number) {
    return prisma.field.findMany({
      where: {
        status: 'maintenance',
        facility: { ownerId }
      },
      select: {
        id: true,
        name: true,
        facility: {
          select: {
            id: true,
            name: true,
            openTime: true,
            closeTime: true
          }
        }
      }
    })
  }

  static async findOwnerCheckInBooking(ownerId: number, keyword: string, bookingIdCandidate?: number) {
    return prisma.booking.findFirst({
      where: {
        field: { facility: { ownerId } },
        status: { in: ['confirmed', 'completed'] },
        OR: [{ checkInCode: { equals: keyword } }, ...(bookingIdCandidate ? [{ id: bookingIdCandidate }] : [])]
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        totalPrice: true,
        depositAmount: true,
        paymentStatus: true,
        checkedInAt: true,
        user: { select: { fullName: true, phone: true } },
        field: { select: { name: true } },
        transactions: {
          where: { type: 'payment', status: 'success' },
          select: { amount: true }
        }
      }
    })
  }

  static async findOwnerCheckInHistory(ownerId: number, start: Date, end: Date, page: number, limit: number) {
    const skip = (page - 1) * limit

    const where = {
      field: { facility: { ownerId } },
      checkedInAt: { not: null, gte: start, lte: end }
    }

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { checkedInAt: 'desc' },
        select: {
          id: true,
          checkedInAt: true,
          user: { select: { fullName: true } },
          field: { select: { name: true } }
        }
      }),
      prisma.booking.count({ where })
    ])

    return {
      data,
      pagination: toPagination(page, limit, total)
    }
  }

  static async findOwnerCheckInBookingById(ownerId: number, bookingId: number) {
    return prisma.booking.findFirst({
      where: {
        id: bookingId,
        field: { facility: { ownerId } }
      },
      select: {
        id: true,
        status: true,
        startTime: true,
        endTime: true,
        totalPrice: true,
        depositAmount: true,
        paymentStatus: true,
        checkedInAt: true,
        user: { select: { fullName: true, phone: true } },
        field: { select: { name: true } },
        transactions: {
          where: { type: 'payment', status: 'success' },
          select: { amount: true }
        }
      }
    })
  }

  static async completeOwnerCheckIn(ownerId: number, bookingId: number, remainingAmount: number) {
    return prisma.$transaction(async (tx) => {
      const updatedCount = await tx.booking.updateMany({
        where: {
          id: bookingId,
          field: { facility: { ownerId } },
          checkedInAt: null
        },
        data: {
          checkedInAt: new Date(),
          ...(remainingAmount > 0 ? { paymentStatus: 'paid' } : {})
        }
      })

      if (updatedCount.count === 0) return null

      if (remainingAmount > 0) {
        await tx.transaction.create({
          data: {
            bookingId,
            amount: remainingAmount,
            type: 'payment',
            method: 'cash',
            status: 'success',
            description: 'Thu tiền còn lại tại sân khi check-in'
          }
        })
      }

      return tx.booking.findUnique({
        where: { id: bookingId },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          totalPrice: true,
          depositAmount: true,
          paymentStatus: true,
          checkedInAt: true,
          user: { select: { fullName: true, phone: true } },
          field: { select: { name: true } },
          transactions: {
            where: { type: 'payment', status: 'success' },
            select: { amount: true }
          }
        }
      })
    })
  }

  static async findOwnerFacilityDetail(ownerId: number, facilityId: number) {
    return prisma.facility.findFirst({
      where: { id: facilityId, ownerId },
      select: {
        id: true,
        name: true,
        description: true,
        sportId: true,
        status: true,
        address: true,
        district: true,
        city: true,
        latitude: true,
        longitude: true,
        openTime: true,
        closeTime: true,
        sport: { select: { id: true, name: true } },
        facilityImages: {
          orderBy: [{ isThumbnail: 'desc' }, { id: 'asc' }],
          select: { id: true, imageUrl: true, isThumbnail: true }
        },
        facilityUtilities: {
          select: {
            utility: {
              select: {
                id: true,
                name: true,
                iconClass: true
              }
            }
          }
        },
        fields: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            fieldPricings: {
              orderBy: [{ isWeekend: 'asc' }, { startTime: 'asc' }],
              select: {
                id: true,
                startTime: true,
                endTime: true,
                pricePerHour: true,
                isWeekend: true
              }
            }
          }
        }
      }
    })
  }

  static async updateOwnerFacility(facilityId: number, data: Prisma.FacilityUpdateInput) {
    return prisma.facility.update({
      where: { id: facilityId },
      data,
      include: {
        sport: true,
        facilityImages: true,
        facilityUtilities: { include: { utility: true } }
      }
    })
  }

  static async deleteOwnerFacility(facilityId: number) {
    return prisma.facility.delete({
      where: { id: facilityId }
    })
  }

  static async countFacilityBookings(facilityId: number) {
    return prisma.booking.count({
      where: {
        field: { facilityId },
        status: { notIn: ['cancelled', 'rejected'] }
      }
    })
  }

  static async updateField(fieldId: number, data: Prisma.FieldUpdateInput) {
    return prisma.field.update({
      where: { id: fieldId },
      data
    })
  }

  static async deleteField(fieldId: number) {
    return prisma.field.delete({
      where: { id: fieldId }
    })
  }

  static async countFieldBookings(fieldId: number) {
    return prisma.booking.count({
      where: {
        fieldId,
        status: { notIn: ['cancelled', 'rejected'] }
      }
    })
  }

  // ========================== Public ==============================
  static async findFeaturedFacilities() {
    const facilities = await prisma.facility.findMany({
      where: { status: 'active' },
      include: {
        sport: {
          select: { id: true, name: true, iconUrl: true }
        },
        facilityImages: {
          where: { isThumbnail: true }
        },
        reviews: {
          select: { rating: true }
        },
        fields: {
          include: {
            fieldPricings: true
          }
        }
      }
    })

    const result = facilities.map(({ reviews, fields, ...f }) => {
      const allPrices = fields.flatMap((field) => field.fieldPricings.map((p) => Number(p.pricePerHour)))

      const minPrice = allPrices.length ? Math.min(...allPrices) : null

      const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null

      return {
        ...f,
        minPrice,
        avgRating
      }
    })

    return result
      .sort((a, b) => {
        const ratingA = a.avgRating ?? 0
        const ratingB = b.avgRating ?? 0

        if (ratingB !== ratingA) return ratingB - ratingA
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, 8)
  }

  static async findPublicFacilities(query: FacilityQueryDto) {
    const { q, city, districts, page = 1, limit = 10, maxPrice, minPrice, sort, sportIds } = query

    const skip = (page - 1) * limit

    const where: Prisma.FacilityWhereInput = {
      status: 'active',
      ...(q && {
        OR: [{ name: { contains: q } }, { address: { contains: q } }, { district: { contains: q } }, { city: { contains: q } }]
      }),
      ...(districts && districts.length > 0 && { districts: { in: districts } }),
      ...(city && { city }),
      ...(sportIds && sportIds.length > 0 && { sportId: { in: sportIds } }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        fields: {
          some: {
            fieldPricings: {
              some: {
                pricePerHour: {
                  ...(minPrice !== undefined ? { gte: minPrice } : {}),
                  ...(maxPrice !== undefined ? { lte: maxPrice } : {})
                }
              }
            }
          }
        }
      })
    }

    const orderBy: Prisma.FacilityOrderByWithRelationInput = sort === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' }

    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        orderBy,
        include: {
          sport: { select: { id: true, name: true, iconUrl: true } },
          facilityImages: { where: { isThumbnail: true }, take: 1 },
          _count: { select: { reviews: true, fields: true } },
          reviews: { select: { rating: true } },
          fields: { include: { fieldPricings: true } }
        }
      }),
      prisma.facility.count({ where })
    ])

    let result = facilities.map(({ reviews, fields, ...f }) => {
      const allPrices = fields.flatMap((field) => field.fieldPricings.map((p) => Number(p.pricePerHour)))

      const minPrice = allPrices.length ? Math.min(...allPrices) : null

      return {
        ...f,
        minPrice,
        avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null,
        reviewCount: reviews.length
      }
    })

    if (sort === 'price_asc') {
      result.sort((a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity))
    } else if (sort === 'price_desc') {
      result.sort((a, b) => (b.minPrice ?? Infinity) - (a.minPrice ?? Infinity))
    } else if (sort === 'rating') {
      result.sort((a, b) => (a.avgRating ?? 0) - (b.avgRating ?? 0))
    }

    const paginationResult = result.slice(skip, skip + limit)

    return {
      data: paginationResult,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  static async findPublicFacilityById(id: number) {
    return prisma.facility.findFirst({
      where: { id, status: 'active' },
      include: {
        sport: true,
        owner: {
          select: { id: true, fullName: true, phone: true, avatarUrl: true }
        },
        facilityImages: true,
        facilityUtilities: { include: { utility: true } },
        fields: {
          where: { status: 'active' },
          include: {
            fieldPricings: { orderBy: [{ isWeekend: 'asc' }, { startTime: 'asc' }] }
          }
        },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } }
      }
    })
  }

  static async findReviewsByFacility(facilityId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { facilityId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true }
          }
        }
      }),
      prisma.review.count({ where: { facilityId } })
    ])

    return { data: reviews, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  static async findFieldsWithBookingsByDate(facilityId: number, date: Date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return prisma.field.findMany({
      where: {
        facilityId,
        status: 'active'
      },
      include: {
        fieldPricings: {
          orderBy: [{ isWeekend: 'asc' }, { startTime: 'asc' }]
        },
        bookings: {
          where: { status: { notIn: ['cancelled', 'rejected'] }, startTime: { gt: startOfDay }, endTime: { lt: endOfDay } },
          select: { startTime: true, endTime: true, status: true }
        }
      }
    })
  }
}
