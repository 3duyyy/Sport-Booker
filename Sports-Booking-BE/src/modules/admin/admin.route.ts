import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { AuthorizationMiddleware } from '../../middlewares/authorization.middleware'
import { adminDashboardRoutes } from './dashboard/dashboard.route'
import { adminUsersRoute } from './users/users.route'
import { adminFacilitiesRoute } from './facilities/facilities.route'
import { adminPaymentVerificationsRoute } from './payment-verifications/payment-verifications.route'
import { adminFinancialsRoute } from './financials/financials.route'

const router = Router()
router.use(authMiddleware, AuthorizationMiddleware.adminOnly())
router.use('/dashboard', adminDashboardRoutes)
router.use('/users', adminUsersRoute)
router.use('/facilities', adminFacilitiesRoute)
router.use('/payment-verifications', adminPaymentVerificationsRoute)
router.use('/financials', adminFinancialsRoute)

export const adminRoutes = router
