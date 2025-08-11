import { Request, Response } from 'express'
import { z } from 'zod'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import {
    deleteSessionService,
    getAllSessionService,
    getSessionByIdService,
} from '../services/session.service'
import { NotFoundException } from '../utils/exception/catch-errors'

export const getAllSessionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.id
        const sessionId = req.sessionId

        if (!userId) {
            throw new NotFoundException('User ID not found')
        }

        const { sessions } = await getAllSessionService(userId)

        const modifySessions = sessions.map((session) => ({
            ...session.get({ plain: true }),
            ...(session.id === sessionId && {
                isCurrent: true,
            }),
        }))

        return res.status(HTTP_STATUS.OK).json({
            message: 'Retrieved all session successfully',
            sessions: modifySessions,
        })
    }
)

export const getSessionController = asyncHandler(
    async (req: Request, res: Response) => {
        const sessionId = req?.sessionId

        if (!sessionId) {
            throw new NotFoundException('Session ID not found. Please log in.')
        }

        const { user } = await getSessionByIdService(sessionId)

        return res.status(HTTP_STATUS.OK).json({
            message: 'Session retrieved successfully',
            user,
        })
    }
)

export const deleteSessionController = asyncHandler(
    async (req: Request, res: Response) => {
        const sessionId = z.string().parse(req.params.id)
        const userId = req.user?.id

        if (!userId) {
            throw new NotFoundException('User ID not found')
        }

        await deleteSessionService(sessionId, userId)

        return res.status(HTTP_STATUS.OK).json({
            message: 'Session remove successfully',
        })
    }
)
