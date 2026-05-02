import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { AppError } from '../shared/exceptions'
import { StatusCodes } from 'http-status-codes'

// Đảm bảo thư mục uploads luôn tồn tại ở thư mục gốc BE, nếu chưa có sẽ create
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname) // Lấy phần mở rộng (.pdf, .png,...)

    // Dùng fieldname thay vì filename bởi vì thời điểm Multer chạy cái hàm này, cái file nó chưa được lưu xuống nên chưa có thuộc tính filename
    cb(null, file.fieldname + '-' + uniqueSuffix + ext) // VD: avatar-1698765432100-123456789.jpg
  }
})

// Chặn file > 5MB và chỉ nhận dạng ảnh
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new AppError('Chỉ cho phép upload file dạng ảnh!', StatusCodes.BAD_REQUEST))
    }
  }
})
