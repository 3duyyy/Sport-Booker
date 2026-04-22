import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../shared/exceptions'
import { StatusCodes } from 'http-status-codes'
import { getQueryString } from '../../shared/utils/utils'
import { UserService } from './users.service'

const TAB_VALUES = ['all', 'pending_confirmation', 'upcoming', 'completed', 'cancelled'] as const
type BookingTabQuery = (typeof TAB_VALUES)[number]

export class UserController {
  static async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id

      const pageRaw = getQueryString(req.query.page)
      const limitRaw = getQueryString(req.query.limit)
      const tabRaw = getQueryString(req.query.tab) ?? 'all'

      const page = pageRaw ? Number(pageRaw) : 1
      const limit = limitRaw ? Number(limitRaw) : 10
      const tab = TAB_VALUES.includes(tabRaw as BookingTabQuery) ? (tabRaw as BookingTabQuery) : 'all'

      if (!Number.isInteger(page) || page <= 0) {
        throw new AppError('page phải là số nguyên dương', StatusCodes.BAD_REQUEST)
      }

      if (!Number.isInteger(limit) || limit <= 0 || limit > 50) {
        throw new AppError('limit phải là số nguyên trong khoảng 1-50', StatusCodes.BAD_REQUEST)
      }

      const result = await UserService.getMyBookings(userId, { page, limit, tab })

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        tabCounts: result.tabCounts
      })
    } catch (error) {
      next(error)
    }
  }

  static async cancelMyBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const bookingId = Number(req.params.bookingId)

      if (!Number.isInteger(bookingId) || bookingId <= 0) {
        throw new AppError('bookingId không hợp lệ', StatusCodes.BAD_REQUEST)
      }

      const reasonRaw = typeof req.body?.reason === 'string' ? req.body.reason.trim() : undefined
      const reason = reasonRaw && reasonRaw.length > 0 ? reasonRaw : undefined

      if (reason && reason.length > 500) {
        throw new AppError('Lý do hủy tối đa 500 ký tự', StatusCodes.BAD_REQUEST)
      }

      const data = await UserService.cancelMyBooking(userId, bookingId, reason)

      res.status(StatusCodes.OK).json({
        success: true,
        data,
        message: 'Hủy lịch đặt thành công'
      })
    } catch (error) {
      next(error)
    }
  }
}
