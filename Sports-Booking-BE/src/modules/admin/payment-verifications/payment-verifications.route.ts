import { Router } from 'express'
import { AdminPaymentVerificationsController } from './payment-verifications.controller'

const router = Router()

router.get('/', AdminPaymentVerificationsController.getList)
router.patch('/:transactionId/approve', AdminPaymentVerificationsController.approve)
router.patch('/:transactionId/reject', AdminPaymentVerificationsController.reject)

export const adminPaymentVerificationsRoute = router
