import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../../shared/exceptions'
import { AdminFacilitiesService } from './facilities.service'
import { getQueryString } from '../../../shared/utils/utils'
import { UpdateAdminFacilityStatusDto } from '../../../dtos/admin.dto'

const PERFORMANCE_VALUES = ['high', 'normal', 'low'] as const
const SORT_BY_VALUES = ['createdAt', 'bookingCount', 'name'] as const

export class AdminFacilitiesController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const pageRaw = getQueryString(req.query.page)
      const limitRaw = getQueryString(req.query.limit)
      const keywordRaw = getQueryString(req.query.keyword)
      const sportIdRaw = getQueryString(req.query.sportId)
      const performanceRaw = getQueryString(req.query.performance)
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

      let sportId: number | undefined
      if (sportIdRaw) {
        const parsed = Number(sportIdRaw)
        if (!Number.isInteger(parsed) || parsed <= 0) {
          throw new AppError('sportId không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        sportId = parsed
      }

      let performance: 'high' | 'normal' | 'low' | undefined
      if (performanceRaw) {
        if (!PERFORMANCE_VALUES.includes(performanceRaw as (typeof PERFORMANCE_VALUES)[number])) {
          throw new AppError('performance không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        performance = performanceRaw as 'high' | 'normal' | 'low'
      }

      const sortBy = SORT_BY_VALUES.includes(sortByRaw as any) ? (sortByRaw as 'createdAt' | 'bookingCount' | 'name') : 'createdAt'
      const sortOrder = sortOrderRaw === 'asc' ? 'asc' : 'desc'

      const result = await AdminFacilitiesService.getList({
        page,
        limit,
        ...(keyword ? { keyword } : {}),
        ...(sportId !== undefined ? { sportId } : {}),
        ...(performance !== undefined ? { performance } : {}),
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

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('id không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const dto = req.body as UpdateAdminFacilityStatusDto
      const data = await AdminFacilitiesService.updateStatus(id, dto)

      res.status(StatusCodes.OK).json({
        success: true,
        data,
        message: dto.status === 'inactive' ? 'Tạm ngưng cơ sở thành công' : 'Kích hoạt lại cơ sở thành công'
      })
    } catch (error) {
      next(error)
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('id không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const data = await AdminFacilitiesService.approve(id)

      res.status(StatusCodes.OK).json({
        success: true,
        data,
        message: 'Phê duyệt cơ sở thành công'
      })
    } catch (error) {
      next(error)
    }
  }
}
