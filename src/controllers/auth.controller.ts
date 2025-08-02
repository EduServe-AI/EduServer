import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import config from '../config/constants'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import User from '../models/user.model'
import { registerUserService } from '../services/auth.service'
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/cookie'
import {
    BadRequestError,
    UnauthorizedError,
} from '../utils/errors/specificErrors'
import { generateToken } from '../utils/jwt'
import { registerSchema } from '../validation/auth.validation'

export const registerUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = registerSchema.parse({
            ...req.body,
        })

        const user = await registerUserService(body)

        const accessToken = generateToken(user.id, user.role, 'access')

        const refreshToken = generateToken(user.id, user.role, 'refresh')

        setRefreshTokenCookie(res, refreshToken)

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'User created successfully',
            data: {
                user,
                accessToken,
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
                    return next(
                        new UnauthorizedError({
                            message:
                                info?.message || 'Invalid email or password',
                        })
                    )
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
        if (!req.isAuthenticated()) {
            throw new BadRequestError({
                message: 'No active session to logout',
            })
        }

        await new Promise<void>((resolve, reject) => {
            req.logout((err) => {
                if (err) reject(err)
                resolve()
            })
        })

        if (req.session) {
            await new Promise<void>((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err)
                    resolve()
                })
            })
        }

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })

        clearRefreshTokenCookie(res)

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Logged out successfully',
        })
    }
)

export const googleLoginCallBackController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new UnauthorizedError({
                message: 'Unauthorized',
            })
        }
        const user = req.user as InstanceType<typeof User> // Type cast to User model
        const accessToken = generateToken(user.id, user.role, 'access')
        const refreshToken = generateToken(user.id, user.role, 'refresh')
        setRefreshTokenCookie(res, refreshToken)

        return res.redirect(
            `${config.FRONTEND_ORIGIN}/token_callback?token=${accessToken}`
        )
    }
)
