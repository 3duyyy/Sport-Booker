import { Router } from 'express'
import { FacilitiesController } from './facilities.controller'
import { validationMiddleware } from '../../middlewares/validation.middleware'
import { CreateFacilityDto } from '../../dtos/facilities.dto'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

// Để public route vì customer cũng có thể tạo sân để thành owner
router.post('/', authMiddleware, validationMiddleware(CreateFacilityDto), FacilitiesController.createFacility)
router.get('/', FacilitiesController.getPublicFacilities)
router.get('/featured', FacilitiesController.getFeaturedFacilities)
router.get('/:id', FacilitiesController.getPublicFacilityById)
router.get('/:id/reviews', FacilitiesController.getFacilityReviews)
router.get('/:id/availability', FacilitiesController.getFacilityAvailability)

export const publicFacilitiesRoutes = router
