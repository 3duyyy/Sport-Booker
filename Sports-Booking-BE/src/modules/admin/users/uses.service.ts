import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../../shared/exceptions'
import { FindManyForAdminParams } from '../../../shared/types/admin'
import { AdminUsersRepository } from './users.repository'
import { CreateAdminUserDto, UpdateAdminUserDto, UpdateAdminUserStatusDto } from '../../../dtos/admin.dto'
import { BcryptUtil } from '../../../shared/utils/bcryptUtil'

export class AdminUsersService {
  static async getList(params: FindManyForAdminParams) {
    const result = await AdminUsersRepository.findManyForAdmin(params)

    return {
      data: result.data.map((item) => ({
        id: item.id,
        roleId: item.roleId,
        email: item.email,
        fullName: item.fullName,
        phone: item.phone,
        avatarUrl: item.avatarUrl,
        status: item.status,
        isVerified: item.isVerified,
        createdAt: item.createdAt.toISOString()
      })),
      pagination: result.pagination
    }
  }

  static async getDetail(id: number) {
    const user = await AdminUsersRepository.findByIdForAdmin(id)

    if (!user) {
      throw new AppError('Không tìm thấy người dùng', StatusCodes.NOT_FOUND)
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  }

  static async create(dto: CreateAdminUserDto) {
    const email = dto.email.trim().toLowerCase()
    const fullName = dto.fullName.trim()
    const phone = dto.phone?.trim()
    const avatarUrl = dto.avatarUrl?.trim()

    const existed = await AdminUsersRepository.findByEmailForAdmin(email)

    if (existed) {
      throw new AppError('Email đã tồn tại', StatusCodes.CONFLICT)
    }

    const passwordHash = await BcryptUtil.hash(dto.password)

    const created = await AdminUsersRepository.createForAdmin({
      roleId: dto.roleId,
      email,
      fullName,
      ...(phone ? { phone } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
      status: dto.status ?? 'active',
      isVerified: dto.isVerified ?? false,
      passwordHash
    })

    return {
      ...created,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString()
    }
  }

  static async update(id: number, dto: UpdateAdminUserDto, actorUserId?: number) {
    const current = await AdminUsersRepository.findByIdForAdmin(id)

    if (!current) {
      throw new AppError('Không tìm thấy người dùng', StatusCodes.NOT_FOUND)
    }

    if (actorUserId && actorUserId === id) {
      if (dto.status === 'banned') {
        throw new AppError('Không thể tự khóa tài khoản của chính mình', StatusCodes.BAD_REQUEST)
      }

      if (dto.roleId !== undefined && dto.roleId !== 1) {
        throw new AppError('Không thể tự hạ quyền admin của chính mình', StatusCodes.BAD_REQUEST)
      }
    }

    const nextEmail = dto.email?.trim().toLowerCase()
    if (nextEmail && nextEmail !== current.email) {
      const existed = await AdminUsersRepository.findByEmailForAdmin(nextEmail)
      if (existed && existed.id !== id) {
        throw new AppError('Email đã tồn tại', StatusCodes.CONFLICT)
      }
    }

    const data: {
      roleId?: 1 | 2 | 3
      email?: string
      fullName?: string
      phone?: string | null
      avatarUrl?: string | null
      status?: 'active' | 'banned' | 'pending_approve'
      isVerified?: boolean
      passwordHash?: string
    } = {}

    if (dto.roleId !== undefined) data.roleId = dto.roleId
    if (nextEmail !== undefined) data.email = nextEmail
    if (dto.fullName !== undefined) data.fullName = dto.fullName.trim()
    if (dto.phone !== undefined) data.phone = dto.phone === null ? null : dto.phone.trim() || null
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl === null ? null : dto.avatarUrl.trim() || null
    if (dto.status !== undefined) data.status = dto.status
    if (dto.isVerified !== undefined) data.isVerified = dto.isVerified
    if (dto.password) data.passwordHash = await BcryptUtil.hash(dto.password)

    const updated = await AdminUsersRepository.updateForAdmin(id, data)

    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    }
  }

  static async updateStatus(id: number, dto: UpdateAdminUserStatusDto, actorUserId?: number) {
    const current = await AdminUsersRepository.findByIdForAdmin(id)

    if (!current) {
      throw new AppError('Không tìm thấy người dùng', StatusCodes.NOT_FOUND)
    }

    if (actorUserId && actorUserId === id && dto.status === 'banned') {
      throw new AppError('Không thể tự khóa tài khoản của chính mình', StatusCodes.BAD_REQUEST)
    }

    const updated = await AdminUsersRepository.updateForAdmin(id, { status: dto.status })

    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    }
  }
}
