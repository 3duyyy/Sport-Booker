import { NextFunction, Request, Response } from 'express'
import { SportsRepository } from './sports.repository'
import { StatusCodes } from 'http-status-codes'

export class SportsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const sports = await SportsRepository.findAll()

      res.status(StatusCodes.OK).json({
        success: true,
        data: sports
      })
    } catch (error) {
      next(error)
    }
  }
}
