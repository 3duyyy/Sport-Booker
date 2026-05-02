import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../shared/exceptions'

export class UploadController {
  static uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Check xem Multer có bắt được file không
      if (!req.file) {
        throw new AppError('Chưa có file nào được tải lên', StatusCodes.BAD_REQUEST)
      }

      // 2. Tạo link public URL
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

      // 3. Trả về đúng format
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Tải ảnh lên thành công',
        data: { url: fileUrl }
      })
    } catch (error) {
      next(error)
    }
  }
}
