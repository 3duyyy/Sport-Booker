import { Router } from 'express'
import { AdminUsersController } from './users.controller'
import { validationMiddleware } from '../../../middlewares/validation.middleware'
import { CreateAdminUserDto, UpdateAdminUserDto, UpdateAdminUserStatusDto } from '../../../dtos/admin.dto'

const router = Router()
router.get('/', AdminUsersController.getList)
router.get('/:id', AdminUsersController.getDetail)
router.post('/', validationMiddleware(CreateAdminUserDto), AdminUsersController.create)
router.patch('/:id', validationMiddleware(UpdateAdminUserDto), AdminUsersController.update)
router.patch('/:id/status', validationMiddleware(UpdateAdminUserStatusDto), AdminUsersController.updateStatus)

export const adminUsersRoute = router
