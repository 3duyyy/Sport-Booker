import { Router } from 'express'
import { UtilitiesController } from './utilities.controller'

const router = Router()

router.get('/', UtilitiesController.getAll)

export const utilitiesRoutes = router
