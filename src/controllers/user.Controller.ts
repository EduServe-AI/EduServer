import { Request, Response } from 'express'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import { getCurrentUserService } from '../services/user.service'
import { UnauthorizedError } from '../utils/exception/specificErrors'
import { ErrorCodeEnum } from '../utils/exception/errorCodes'

export const getCurrentUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.id

        if (!userId) {
            throw new UnauthorizedError({
                message: ErrorCodeEnum.ACCESS_UNAUTHORIZED,
            })
        }

        const { user } = await getCurrentUserService(userId)

        return res.status(HTTP_STATUS.OK).json({
            message: 'User fetch successfully',
            user,
        })
    }
)
