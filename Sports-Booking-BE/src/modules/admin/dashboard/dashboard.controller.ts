import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../../shared/exceptions'
import { AdminDashboardService } from './dashboard.service'

export class AdminDashboardController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const days = Number(req.query.days ?? 30)
      const topPage = Number(req.query.topPage ?? 1)
      const topLimit = Number(req.query.topLimit ?? 10)
      const activityLimit = Number(req.query.activityLimit ?? 10)

      if (Number.isNaN(days) || days <= 0 || days > 365) {
        throw new AppError('days phải là số trong khoảng 1-365', StatusCodes.BAD_REQUEST)
      }

      if (Number.isNaN(topPage) || topPage <= 0 || !Number.isInteger(topPage)) {
        throw new AppError('topPage phải là số nguyên dương', StatusCodes.BAD_REQUEST)
      }

      if (Number.isNaN(topLimit) || topLimit <= 0 || topLimit > 100 || !Number.isInteger(topLimit)) {
        throw new AppError('topLimit phải là số nguyên trong khoảng 1-100', StatusCodes.BAD_REQUEST)
      }

      if (Number.isNaN(activityLimit) || activityLimit <= 0 || activityLimit > 50 || !Number.isInteger(activityLimit)) {
        throw new AppError('activityLimit phải là số nguyên trong khoảng 1-50', StatusCodes.BAD_REQUEST)
      }

      const data = await AdminDashboardService.getOverview({
        days,
        topPage,
        topLimit,
        activityLimit
      })

      res.status(StatusCodes.OK).json({
        success: true,
        data
      })
    } catch (error) {
      next(error)
    }
  }
}
