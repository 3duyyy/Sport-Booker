import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { AuthorizationMiddleware } from '../../middlewares/authorization.middleware'
import { UserController } from './users.controller'

const router = Router()
router.use(authMiddleware, AuthorizationMiddleware.permission('view_own_bookings'))

router.get('/bookings', UserController.getMyBookings)
router.patch('/bookings/:bookingId/cancel', UserController.cancelMyBooking)

export const usersRoute = router
