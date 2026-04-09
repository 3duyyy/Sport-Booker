import { Router } from 'express'
import { AdminDashboardController } from './dashboard.controller'

const router = Router()

router.get('/', AdminDashboardController.getOverview)

export const adminDashboardRoutes = router
