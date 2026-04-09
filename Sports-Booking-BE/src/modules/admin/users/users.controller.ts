import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../../shared/exceptions'
import { AdminUsersService } from './uses.service'
import { getQueryString, ROLE_IDS, USER_STATUSES } from '../../../shared/utils/utils'
import { NextFunction, Request, Response } from 'express'
import { CreateAdminUserDto, UpdateAdminUserDto, UpdateAdminUserStatusDto } from '../../../dtos/admin.dto'

export class AdminUsersController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const pageRaw = getQueryString(req.query.page)
      const limitRaw = getQueryString(req.query.limit)
      const keywordRaw = getQueryString(req.query.keyword)
      const roleIdRaw = getQueryString(req.query.roleId)
      const statusRaw = getQueryString(req.query.status)
      const sortByRaw = getQueryString(req.query.sortBy)
      const sortOrderRaw = getQueryString(req.query.sortOrder)

      const page = pageRaw ? Number(pageRaw) : 1
      const limit = limitRaw ? Number(limitRaw) : 10
      const keyword = (keywordRaw ?? '').trim()

      if (!Number.isInteger(page) || page <= 0) {
        throw new AppError('page phải là số nguyên dương', StatusCodes.BAD_REQUEST)
      }

      if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
        throw new AppError('limit phải là số nguyên trong khoảng 1-100', StatusCodes.BAD_REQUEST)
      }

      if (keyword.length > 100) {
        throw new AppError('keyword tối đa 100 ký tự', StatusCodes.BAD_REQUEST)
      }

      let roleId: number | undefined
      if (roleIdRaw) {
        const parsedRole = Number(roleIdRaw)
        if (!Number.isInteger(parsedRole) || !ROLE_IDS.includes(parsedRole as (typeof ROLE_IDS)[number])) {
          throw new AppError('roleId không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        roleId = parsedRole
      }

      let status: 'active' | 'banned' | 'pending_approve' | undefined
      if (statusRaw) {
        if (!USER_STATUSES.includes(statusRaw as (typeof USER_STATUSES)[number])) {
          throw new AppError('status không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        status = statusRaw as 'active' | 'banned' | 'pending_approve'
      }

      const sortBy = sortByRaw === 'fullName' ? 'fullName' : 'createdAt'
      const sortOrder = sortOrderRaw === 'asc' ? 'asc' : 'desc'

      const result = await AdminUsersService.getList({
        page,
        limit,
        ...(keyword ? { keyword } : {}),
        ...(roleId !== undefined ? { roleId } : {}),
        ...(status !== undefined ? { status } : {}),
        sortBy,
        sortOrder
      })

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('id không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const data = await AdminUsersService.getDetail(id)
      res.status(StatusCodes.OK).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateAdminUserDto
      const data = await AdminUsersService.create(dto)

      res.status(StatusCodes.OK).json({
        success: true,
        data,
        message: 'Tạo người dùng thành công'
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('id không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const dto = req.body as UpdateAdminUserDto
      if (Object.keys(dto).length === 0) {
        throw new AppError('Không có dữ liệu để cập nhật', StatusCodes.BAD_REQUEST)
      }

      const data = await AdminUsersService.update(id, dto, req.user?.id)

      res.status(StatusCodes.OK).json({
        success: true,
        data,
        message: 'Cập nhật người dùng thành công'
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('id không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const dto = req.body as UpdateAdminUserStatusDto
      const data = await AdminUsersService.updateStatus(id, dto, req.user?.id)

      res.status(StatusCodes.OK).json({
        success: true,
        data,
        message: dto.status === 'banned' ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công'
      })
    } catch (error) {
      next(error)
    }
  }
}
