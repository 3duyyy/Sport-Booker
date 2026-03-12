import { Router } from 'express'
import { authRoutes } from '../modules/auth/auth.route'
import { ownerRoute } from '../modules/facilities/facilities.route'
import { publicFacilitiesRoutes } from '../modules/facilities/facilities.public.route'
import { sportsRoutes } from '../modules/sports/sports.route'
import { utilitiesRoutes } from '../modules/utilities/utilities.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/owner', ownerRoute)
router.use('/facilities', publicFacilitiesRoutes)
router.use('/sports', sportsRoutes)
router.use('/utilities', utilitiesRoutes)

export const api = router
