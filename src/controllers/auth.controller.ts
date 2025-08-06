import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import config from '../config/constants'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import { registerUserService } from '../services/auth.service'
import { UnauthorizedError } from '../utils/exception/specificErrors'
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
                        message:
                            info?.message || 'Invalid email or password test1',
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
        req.logout((err) => {
            if (err) {
                console.error('Logout error', err)
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    error: 'Failed to log out',
                })
            }

            // Destroy the session to completely clear it
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    console.error('Session destroy error', destroyErr)
                    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        error: 'Failed to destroy session',
                    })
                }

                // Clear the session cookie - express-session uses 'sessionId' by default
                res.clearCookie('sessionId', {
                    httpOnly: true,
                    secure: config.NODE_ENV === 'production',
                    sameSite: 'lax',
                })

                return res.status(HTTP_STATUS.OK).json({
                    message: 'Logged out successfully',
                })
            })
        })
    }
)

export const googleLoginCallBackController = asyncHandler(
    async (req: Request, res: Response) => {
        console.log('googleLoginCallBackController - req.user:', req.user)
        console.log('googleLoginCallBackController - req.session:', req.session)

        if (!req.user) {
            return res.redirect(
                `${config.FRONTEND_ORIGIN}/login?error=authentication_failed`
            )
        }

        return res.redirect(`${config.FRONTEND_ORIGIN}/`)
    }
)
