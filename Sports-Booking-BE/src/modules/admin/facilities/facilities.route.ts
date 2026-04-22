import { Router } from 'express'
import { AdminFacilitiesController } from './facilities.controller'
import { validationMiddleware } from '../../../middlewares/validation.middleware'
import { UpdateAdminFacilityStatusDto } from '../../../dtos/admin.dto'
import { authMiddleware } from '../../../middlewares/auth.middleware'
import { AuthorizationMiddleware } from '../../../middlewares/authorization.middleware'

const router = Router()

router.get('/', AdminFacilitiesController.getList)
router.patch('/:id/status', validationMiddleware(UpdateAdminFacilityStatusDto), AdminFacilitiesController.updateStatus)
router.patch('/:id/approve', AdminFacilitiesController.approve)

export const adminFacilitiesRoute = router
