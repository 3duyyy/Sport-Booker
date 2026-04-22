import { Router } from 'express'
import { AdminFinancialsController } from './financials.controller'

const router = Router()

router.get('/summary', AdminFinancialsController.getSummary)
router.get('/payouts', AdminFinancialsController.getPayouts)
router.get('/refunds', AdminFinancialsController.getRefunds)
router.patch('/payouts/:ownerId/settle', AdminFinancialsController.settlePayout)
router.patch('/refunds/:refundId/approve', AdminFinancialsController.approveRefund)

export const adminFinancialsRoute = router
