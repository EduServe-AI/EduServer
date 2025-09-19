import { Request, Response } from 'express'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import { onboardingSchema } from '../validation/onboarding.validation'

import { onboardInstructor } from '../services/onboarding.service'

export const onboardInstructorController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const body = onboardingSchema.parse({
            ...req.body,
        })

        const userId = req.user?.id
        if (!userId) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Authentication error: User ID not found.',
            })
        }

        const { instructorProfile } = await onboardInstructor(body, userId)

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Instructor onboarded successfully',
            data: { instructorProfile },
        })
    }
)
