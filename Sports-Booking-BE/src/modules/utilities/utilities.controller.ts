import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UtilitiesRepository } from './utilities.repository'

export class UtilitiesController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const utilities = await UtilitiesRepository.findAll()
      res.status(StatusCodes.OK).json({
        success: true,
        data: utilities
      })
    } catch (error) {
      next(error)
    }
  }
}
