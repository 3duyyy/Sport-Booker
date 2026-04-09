import { User } from '../../../generated/prisma'
import { ROLES } from '../../shared/constants/roles'
import { prisma } from '../../shared/prisma/client'

export class UsersRepository {
  static async createUser(data: {
    email: string
    passwordHash: string
    fullName: string
    phone?: string
    roleId: number
  }): Promise<User> {
    return prisma.user.create({ data: { ...data, isVerified: true }, include: { role: true } })
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        status: true,
        isVerified: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            rolePermissions: {
              select: { permission: { select: { slug: true } } }
            }
          }
        }
      }
    })
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
    })
  }

  static async findByIdWithPassword(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, passwordHash: true }
    })
  }

  static async updatePassword(id: number, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash }
    })
  }

  static async upgradeToOwner(id: number) {
    return prisma.user.update({
      where: { id },
      data: { roleId: ROLES.OWNER }
    })
  }

  static async updateProfile(id: number, data: { fullName?: string; phone?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id },
      data: data
    })
  }

  static async updateStatus(id: number, status: 'active' | 'banned' | 'pending_approve') {
    return prisma.user.update({
      where: { id },
      data: { status }
    })
  }

  static async verifyEmail(id: number) {
    return prisma.user.update({ where: { id }, data: { isVerified: true } })
  }
}
