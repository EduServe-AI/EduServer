import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import config from '../config/constants'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import { registerUserService } from '../services/auth.service'
import {
    BadRequestError,
    UnauthorizedError,
} from '../utils/errors/specificErrors'
import { registerSchema } from '../validation/auth.validation'

export const registerUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = registerSchema.parse({
            ...req.body,
        })

        const user = await registerUserService(body)

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'User created successfully',
            data: {
                user,
            },
        })
    }
)

export const loginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            'local',
            (
                err: Error | null,
                user: Express.User | false,
                info: { message: string } | undefined
            ) => {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    throw new UnauthorizedError({
                        message: info?.message || 'Invalid email or password',
                    })
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err)
                    }
                    return res.status(HTTP_STATUS.OK).json({
                        message: 'Logged in successfully',
                        user,
                    })
                })
            }
        )(req, res, next)
    }
)

export const logoutController = asyncHandler(
    async (req: Request, res: Response) => {
        // Check if user is authenticated
        if (!req.isAuthenticated()) {
            throw new BadRequestError({
                message: 'No active session to logout',
            })
        }

        // Handle logout with Promise
        await new Promise<void>((resolve, reject) => {
            req.logout((err) => {
                if (err) reject(err)
                resolve()
            })
        })

        // Destroy session if it exists
        if (req.session) {
            await new Promise<void>((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err)
                    resolve()
                })
            })
        }

        // Clear session cookie
        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Logged out successfully',
        })
    }
)

export const googleLoginCallBackController = asyncHandler(
    async (req: Request, res: Response) => {
        return res.redirect(`${config.FRONTEND_ORIGIN}/`)
    }
)
