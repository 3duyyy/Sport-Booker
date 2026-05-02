import { Router } from 'express'
import { upload } from '../../middlewares/upload.middleware'
import { UploadController } from './upload.controller'

const router = Router()

// upload.single('image'): là key để FE append vào FormData
router.post('/', upload.single('image'), UploadController.uploadSingle)

export const uploadRoute = router
