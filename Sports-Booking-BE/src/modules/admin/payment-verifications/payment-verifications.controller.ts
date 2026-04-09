import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../../shared/exceptions'
import { getQueryString } from '../../../shared/utils/utils'
import { AdminPaymentVerificationsService } from './payment-verifications.service'

const STATUS_VALUES = ['pending', 'approved', 'rejected'] as const
const TYPE_VALUES = ['full_payment', 'deposit'] as const
const SORT_BY_VALUES = ['transferredAt', 'amount'] as const

export class AdminPaymentVerificationsController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const pageRaw = getQueryString(req.query.page)
      const limitRaw = getQueryString(req.query.limit)
      const keywordRaw = getQueryString(req.query.keyword)
      const statusRaw = getQueryString(req.query.status)
      const verificationTypeRaw = getQueryString(req.query.verificationType)
      const sortByRaw = getQueryString(req.query.sortBy)
      const sortOrderRaw = getQueryString(req.query.sortOrder)
      const fromRaw = getQueryString(req.query.from)
      const toRaw = getQueryString(req.query.to)

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

      let status: 'pending' | 'approved' | 'rejected' | undefined
      if (statusRaw) {
        if (!STATUS_VALUES.includes(statusRaw as (typeof STATUS_VALUES)[number])) {
          throw new AppError('status không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        status = statusRaw as 'pending' | 'approved' | 'rejected'
      }

      let verificationType: 'full_payment' | 'deposit' | undefined
      if (verificationTypeRaw) {
        if (!TYPE_VALUES.includes(verificationTypeRaw as (typeof TYPE_VALUES)[number])) {
          throw new AppError('verificationType không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        verificationType = verificationTypeRaw as 'full_payment' | 'deposit'
      }

      let from: Date | undefined
      if (fromRaw) {
        const parsed = new Date(fromRaw)
        if (Number.isNaN(parsed.getTime())) {
          throw new AppError('from không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        parsed.setHours(0, 0, 0, 0)
        from = parsed
      }

      let to: Date | undefined
      if (toRaw) {
        const parsed = new Date(toRaw)
        if (Number.isNaN(parsed.getTime())) {
          throw new AppError('to không hợp lệ', StatusCodes.BAD_REQUEST)
        }
        parsed.setHours(23, 59, 59, 999)
        to = parsed
      }

      if (from && to && from > to) {
        throw new AppError('from không được lớn hơn to', StatusCodes.BAD_REQUEST)
      }

      const sortBy = SORT_BY_VALUES.includes(sortByRaw as any) ? (sortByRaw as 'transferredAt' | 'amount') : 'transferredAt'

      const sortOrder = sortOrderRaw === 'asc' ? 'asc' : 'desc'

      const result = await AdminPaymentVerificationsService.getList({
        page,
        limit,
        ...(keyword ? { keyword } : {}),
        ...(status ? { status } : {}),
        ...(verificationType ? { verificationType } : {}),
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
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

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const txId = Number(req.params.transactionId)
      if (!Number.isInteger(txId) || txId <= 0) {
        throw new AppError('transactionId không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const result = await AdminPaymentVerificationsService.review(txId, 'approve')

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Duyệt giao dịch thành công',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const txId = Number(req.params.transactionId)
      if (!Number.isInteger(txId) || txId <= 0) {
        throw new AppError('transactionId không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const reasonRaw = typeof req.body?.reason === 'string' ? req.body.reason.trim() : ''
      if (reasonRaw.length > 255) {
        throw new AppError('reason tối đa 255 ký tự', StatusCodes.BAD_REQUEST)
      }

      const result = await AdminPaymentVerificationsService.review(txId, 'reject', reasonRaw || undefined)

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Từ chối giao dịch thành công',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}
