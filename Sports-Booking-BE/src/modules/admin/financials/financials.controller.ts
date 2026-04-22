import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../../shared/exceptions'
import { getQueryString } from '../../../shared/utils/utils'
import { AdminFinancialsService } from './financials.service'
import { FindManyPayoutsParams } from '../../../shared/types/admin'

const SORT_BY_VALUES = ['createdAt', 'amount'] as const

const parseListQuery = (req: Request): FindManyPayoutsParams => {
  const pageRaw = getQueryString(req.query.page)
  const limitRaw = getQueryString(req.query.limit)
  const keywordRaw = getQueryString(req.query.keyword)
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

  const sortBy: 'createdAt' | 'amount' = SORT_BY_VALUES.includes(sortByRaw as any)
    ? (sortByRaw as 'createdAt' | 'amount')
    : 'createdAt'

  const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'asc' ? 'asc' : 'desc'

  const query: FindManyPayoutsParams = {
    page,
    limit,
    sortBy,
    sortOrder
  }

  if (keyword) {
    query.keyword = keyword
  }

  return query
}

export class AdminFinancialsController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminFinancialsService.getSummary()

      res.status(StatusCodes.OK).json({
        success: true,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async getPayouts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parseListQuery(req)
      const result = await AdminFinancialsService.getPayouts(query)

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  static async getRefunds(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parseListQuery(req)
      const result = await AdminFinancialsService.getRefunds(query)

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  static async settlePayout(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = Number(req.params.ownerId)

      if (!ownerId || isNaN(ownerId)) {
        throw new AppError('Owner ID không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const result = await AdminFinancialsService.settlePayout(ownerId)

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Thanh toán thành công',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async approveRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const refundId = Number(req.params.refundId)

      if (!refundId || isNaN(refundId)) {
        throw new AppError('Refund ID không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const result = await AdminFinancialsService.approveRefund(refundId)

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Xác nhận hoàn tiền thành công',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}
