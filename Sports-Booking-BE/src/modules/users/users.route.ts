import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { AuthorizationMiddleware } from '../../middlewares/authorization.middleware'
import { UserController } from './users.controller'
import { validationMiddleware } from '../../middlewares/validation.middleware'
import { UpdateProfileDto } from '../../dtos/users.dto'

const router = Router()
router.get('/me', authMiddleware, UserController.getProfile)
router.patch('/me', authMiddleware, validationMiddleware(UpdateProfileDto), UserController.updateProfile)

router.use(authMiddleware, AuthorizationMiddleware.permission('view_own_bookings'))
router.get('/bookings', UserController.getMyBookings)
router.patch('/bookings/:bookingId/cancel', UserController.cancelMyBooking)

export const usersRoute = router
