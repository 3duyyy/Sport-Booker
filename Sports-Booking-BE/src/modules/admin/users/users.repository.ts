import { Prisma } from '../../../../generated/prisma'
import { prisma } from '../../../shared/prisma/client'
import { FindManyForAdminParams } from '../../../shared/types/admin'

export class AdminUsersRepository {
  static async findManyForAdmin(params: FindManyForAdminParams) {
    const skip = (params.page - 1) * params.limit

    const where: Prisma.UserWhereInput = {}

    if (params.roleId !== undefined) {
      where.roleId = params.roleId
    }

    if (params.status) {
      where.status = params.status
    }

    if (params.keyword) {
      const orConditions: Prisma.UserWhereInput[] = [
        { fullName: { contains: params.keyword } },
        { email: { contains: params.keyword } },
        { phone: { contains: params.keyword } }
      ]

      if (/^\d+$/.test(params.keyword)) {
        orConditions.push({ id: Number(params.keyword) })
      }

      where.OR = orConditions
    }

    const orderBy: Prisma.UserOrderByWithRelationInput =
      params.sortBy === 'fullName' ? { fullName: params.sortOrder } : { createdAt: params.sortOrder }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: params.limit,
        orderBy,
        select: {
          id: true,
          roleId: true,
          email: true,
          fullName: true,
          phone: true,
          avatarUrl: true,
          status: true,
          isVerified: true,
          createdAt: true
        }
      }),
      prisma.user.count({ where })
    ])

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.limit))
      }
    }
  }

  static async findByIdForAdmin(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        roleId: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async findByEmailForAdmin(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    })
  }

  static async createForAdmin(data: {
    roleId: 1 | 2 | 3
    email: string
    fullName: string
    phone?: string
    avatarUrl?: string
    status: 'active' | 'banned' | 'pending_approve'
    isVerified: boolean
    passwordHash: string
  }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        roleId: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async updateForAdmin(
    id: number,
    data: {
      roleId?: 1 | 2 | 3
      email?: string
      fullName?: string
      phone?: string | null
      avatarUrl?: string | null
      status?: 'active' | 'banned' | 'pending_approve'
      isVerified?: boolean
      passwordHash?: string
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        roleId: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }
}
