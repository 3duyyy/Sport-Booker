import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { AuthorizationMiddleware } from '../../middlewares/authorization.middleware'
import { validationMiddleware } from '../../middlewares/validation.middleware'
import { CreateBookingDto } from '../../dtos/bookings.dto'
import { BookingsController } from './bookings.controller'

const router = Router()
router.use(authMiddleware)

router.post(
  '/',
  AuthorizationMiddleware.permission('create_booking'),
  validationMiddleware(CreateBookingDto),
  BookingsController.createBooking
)

export const bookingsRoutes = router
