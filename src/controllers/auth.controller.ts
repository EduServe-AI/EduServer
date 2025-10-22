import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { config } from '../config/app.config'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import passport from '../middlewares/passport.middleware'
import {
    forgotPasswordService,
    loginService,
    loginWithGoogleService,
    logoutService,
    refreshTokenService,
    registerService,
    resePasswordService,
    verifyEmailService,
} from '../services/auth.service'
import {
    clearAuthenticationCookies,
    getRefreshTokenCookieOptions,
    setAuthenticationCookies,
} from '../utils/cookie'
import {
    NotFoundException,
    UnauthorizedException,
} from '../utils/exception/catch-errors'
import {
    emailSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verificationEmailSchema,
} from '../validation/auth.validation'

export const registerController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const userAgent = req.headers['user-agent']
        const body = registerSchema.parse({
            ...req.body,
            userAgent,
        })
        const { user, accessToken, refreshToken } = await registerService(body)
        const csrfToken = crypto.randomBytes(32).toString('hex')
        return setAuthenticationCookies({
            res,
            // accessToken,
            refreshToken,
            csrfToken,
        })
            .status(HTTP_STATUS.CREATED)
            .json({
                message: 'User registered successfully',
                user,
                secret: {
                    accessToken,
                },
            })
    }
)

export const loginController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const userAgent = req.headers['user-agent']
        const body = loginSchema.parse({
            ...req.body,
            userAgent,
        })

        const { user, accessToken, refreshToken, mfaRequired } =
            await loginService(body)

        if (mfaRequired) {
            return res.status(HTTP_STATUS.OK).json({
                message: 'Verify MFA authentication',
                mfaRequired,
                user,
            })
        }

        const csrfToken = crypto.randomBytes(32).toString('hex')
        return setAuthenticationCookies({
            res,
            // accessToken,
            refreshToken,
            csrfToken,
        })
            .status(HTTP_STATUS.OK)
            .json({
                message: 'User login successfully',
                mfaRequired,
                user,
                secret: {
                    accessToken,
                },
            })
    }
)

export const refreshTokenController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const refreshToken = req.cookies.refreshToken as string | undefined

        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token')
        }

        const { accessToken, newRefreshToken } =
            await refreshTokenService(refreshToken)

        if (newRefreshToken) {
            res.cookie(
                'refreshToken',
                newRefreshToken,
                getRefreshTokenCookieOptions()
            )
        }

        return (
            res
                .status(HTTP_STATUS.OK)
                // .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
                .json({
                    message: 'Refresh access token successfully',
                    accessToken,
                })
        )
    }
)

export const verifyEmailController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const { code } = verificationEmailSchema.parse(req.body)
        await verifyEmailService(code)

        return res.status(HTTP_STATUS.OK).json({
            message: 'Email verified successfully',
        })
    }
)

export const forgotPasswordController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const email = emailSchema.parse(req.body.email)
        await forgotPasswordService(email)

        return res.status(HTTP_STATUS.OK).json({
            message: 'Password reset email sent',
        })
    }
)

export const resetPasswordController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const body = resetPasswordSchema.parse(req.body)

        await resePasswordService(body)

        return clearAuthenticationCookies(res).status(HTTP_STATUS.OK).json({
            message: 'Reset Password successfully',
        })
    }
)

export const logoutController = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        const sessionId = req.sessionId
        if (!sessionId) {
            throw new NotFoundException('Session is invalid.')
        }
        await logoutService(sessionId)
        return clearAuthenticationCookies(res).status(HTTP_STATUS.OK).json({
            message: 'User logout successfully',
        })
    }
)

export const googleAuthController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userType = req.query.userType
        const authFlow = req.query.authFlow

        passport.authenticate('google', {
            scope: ['profile', 'email'],
            session: false,
            state: JSON.stringify({ userType, authFlow }),
        })(req, res, next)
    }
)

export const googleCallbackController = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            passport.authenticate(
                'google',
                { session: false },
                async (
                    err: Error | null,
                    user: Express.User | false,
                    info?: { message?: string }
                ) => {
                    try {
                        if (err) {
                            return reject(err)
                        }
                        if (!user) {
                            const errorMsg =
                                info?.message ||
                                'Account not found. Please sign up first.'

                            res.redirect(
                                `${config.FRONTEND_ORIGIN}/signin?message=${encodeURIComponent(errorMsg)}`
                            )
                            return resolve()
                        }

                        const userAgent = req.headers['user-agent']
                        const { refreshToken, accessToken } =
                            await loginWithGoogleService(user.id, userAgent)
                        const csrfToken = crypto.randomBytes(32).toString('hex')

                        setAuthenticationCookies({
                            res,
                            // accessToken,
                            refreshToken,
                            csrfToken,
                        })

                        res.redirect(`${config.FRONTEND_ORIGIN}/dashboard`)

                        const redirectUrl = new URL(
                            `${config.FRONTEND_ORIGIN}/dashboard`
                        )
                        redirectUrl.searchParams.set('accessToken', accessToken)
                        res.redirect(redirectUrl.toString())

                        return resolve()
                    } catch (e) {
                        return reject(e)
                    }
                }
            )(req, res)
        })
    }
)
