import { Router } from 'express'
import { AdminFinancialsController } from './financials.controller'

const router = Router()

router.get('/summary', AdminFinancialsController.getSummary)
router.get('/payouts', AdminFinancialsController.getPayouts)
router.get('/refunds', AdminFinancialsController.getRefunds)

export const adminFinancialsRoute = router
