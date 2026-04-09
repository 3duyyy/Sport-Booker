import { Router } from 'express'
import { AdminFacilitiesController } from './facilities.controller'
import { validationMiddleware } from '../../../middlewares/validation.middleware'
import { UpdateAdminFacilityStatusDto } from '../../../dtos/admin.dto'

const router = Router()

router.get('/', AdminFacilitiesController.getList)
router.patch('/:id/status', validationMiddleware(UpdateAdminFacilityStatusDto), AdminFacilitiesController.updateStatus)

export const adminFacilitiesRoute = router
