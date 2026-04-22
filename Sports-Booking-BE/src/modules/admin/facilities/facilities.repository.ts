import { Prisma } from '../../../../generated/prisma'
import { UpdateAdminFacilityStatusDto } from '../../../dtos/admin.dto'
import { prisma } from '../../../shared/prisma/client'
import { FindManyFacilitiesParams } from '../../../shared/types/admin'

type PerformanceLevel = 'high' | 'normal' | 'low'

const HIGH_THRESHOLD = 260
const NORMAL_THRESHOLD = 80

const toPerformance = (bookingCount: number): PerformanceLevel => {
  if (bookingCount >= HIGH_THRESHOLD) return 'high'
  if (bookingCount >= NORMAL_THRESHOLD) return 'normal'
  return 'low'
}

export class AdminFacilitiesRepository {
  static async findManyForAdmin(params: FindManyFacilitiesParams) {
    const where: Prisma.FacilityWhereInput = {
      ...(params.sportId !== undefined ? { sportId: params.sportId } : {}),
      ...(params.keyword
        ? {
            OR: [
              { name: { contains: params.keyword } },
              { address: { contains: params.keyword } },
              { district: { contains: params.keyword } },
              { city: { contains: params.keyword } },
              { owner: { fullName: { contains: params.keyword } } }
            ]
          }
        : {})
    }

    const matchedFacilities = await prisma.facility.findMany({
      where,
      select: { id: true, createdAt: true, name: true }
    })

    const facilityIds = matchedFacilities.map((item) => item.id)

    if (facilityIds.length === 0) {
      return {
        data: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 1
        }
      }
    }

    const fields = await prisma.field.findMany({
      where: { facilityId: { in: facilityIds } },
      select: { id: true, facilityId: true }
    })

    const fieldIdToFacilityId = new Map<number, number>()
    const fieldIds: number[] = []

    for (const field of fields) {
      fieldIds.push(field.id)
      fieldIdToFacilityId.set(field.id, field.facilityId)
    }

    const bookingCountsByField = fieldIds.length
      ? await prisma.booking.groupBy({
          by: ['fieldId'],
          where: {
            fieldId: { in: fieldIds },
            status: { in: ['pending', 'confirmed', 'completed'] }
          },
          _count: { _all: true }
        })
      : []

    const bookingCountByFacilityId = new Map<number, number>()

    for (const row of bookingCountsByField) {
      const facilityId = fieldIdToFacilityId.get(row.fieldId)
      if (!facilityId) continue
      const prev = bookingCountByFacilityId.get(facilityId) ?? 0
      bookingCountByFacilityId.set(facilityId, prev + row._count._all)
    }

    const performanceByFacilityId = new Map<number, PerformanceLevel>()
    for (const facilityId of facilityIds) {
      const bookingCount = bookingCountByFacilityId.get(facilityId) ?? 0
      performanceByFacilityId.set(facilityId, toPerformance(bookingCount))
    }

    const filteredFacilityIds =
      params.performance === undefined
        ? facilityIds
        : facilityIds.filter((id) => performanceByFacilityId.get(id) === params.performance)

    if (filteredFacilityIds.length === 0) {
      return {
        data: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 1
        }
      }
    }

    const facilities = await prisma.facility.findMany({
      where: { id: { in: filteredFacilityIds } },
      include: {
        owner: { select: { id: true, fullName: true } },
        sport: { select: { id: true, name: true } },
        facilityImages: {
          where: { isThumbnail: true },
          take: 1,
          orderBy: { id: 'asc' },
          select: { imageUrl: true }
        },
        _count: { select: { fields: true } }
      }
    })

    const mapped = facilities.map((facility) => {
      const bookingCount = bookingCountByFacilityId.get(facility.id) ?? 0
      return {
        id: facility.id,
        ownerId: facility.ownerId,
        ownerName: facility.owner.fullName,
        sportId: facility.sportId,
        sportName: facility.sport.name,
        name: facility.name,
        address: facility.address,
        district: facility.district,
        city: facility.city,
        thumbnailUrl: facility.facilityImages[0]?.imageUrl ?? null,
        status: facility.status,
        performance: performanceByFacilityId.get(facility.id) ?? 'low',
        fieldCount: facility._count.fields,
        bookingCount,
        createdAt: facility.createdAt
      }
    })

    mapped.sort((a, b) => {
      if (params.sortBy === 'bookingCount') {
        const diff = a.bookingCount - b.bookingCount
        return params.sortOrder === 'asc' ? diff : -diff
      }

      if (params.sortBy === 'name') {
        const diff = a.name.localeCompare(b.name, 'vi')
        return params.sortOrder === 'asc' ? diff : -diff
      }

      const diff = a.createdAt.getTime() - b.createdAt.getTime()
      return params.sortOrder === 'asc' ? diff : -diff
    })

    const total = mapped.length
    const totalPages = Math.max(1, Math.ceil(total / params.limit))
    const start = (params.page - 1) * params.limit
    const end = start + params.limit
    const data = mapped.slice(start, end)

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages
      }
    }
  }

  static async findByIdForAdmin(id: number) {
    return prisma.facility.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    })
  }

  static async updateStatusForAdmin(id: number, status: 'active' | 'inactive') {
    return prisma.facility.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    })
  }

  static async approvePendingForAdmin(id: number) {
    const result = await prisma.facility.updateMany({
      where: { id, status: 'pending_approve' },
      data: { status: 'active' }
    })

    if (result.count === 0) return null

    return prisma.facility.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    })
  }
}
