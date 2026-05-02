import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../shared/exceptions'

export const validationMiddleware = (dtoClass: any, property: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[property] || {}

      const dtoInstance = plainToInstance(dtoClass, dataToValidate)

      const errors: ValidationError[] = await validate(dtoInstance)

      if (errors.length > 0) {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {})
        }))

        throw new AppError('Validation failed!', StatusCodes.BAD_REQUEST, formattedErrors)
      }

      // req.query và req.params là read-only nên ko thể ghi đè 1 object mới mà chỉ có thể thêm/sửa/xóa các properties
      if (property === 'body') {
        req.body = dtoInstance
      } else {
        Object.keys(req[property]).forEach((key) => delete req[property][key])
        Object.assign(req[property], dtoInstance)
      }
      next()
    } catch (error) {
      console.error('Validation Error:', error)
      next(error)
    }
  }
}
