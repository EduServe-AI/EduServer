import { Router } from 'express'
import { onboardInstructorController } from '../controllers/onboarding.controller'

const router = Router()

router.post('/instructor', onboardInstructorController)

export default router
