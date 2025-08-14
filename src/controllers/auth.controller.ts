import { Request, Response } from 'express'
import { HTTP_STATUS } from '../config/http.config'
import asyncHandler from '../middlewares/asyncHandler.middleware'
import {
    forgotPasswordService,
    loginService,
    logoutService,
    refreshTokenService,
    registerService,
    resePasswordService,
    verifyEmailService,
} from '../services/auth.service'
import {
    clearAuthenticationCookies,
    getAccessTokenCookieOptions,
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
        const body = registerSchema.parse({
            ...req.body,
        })
        const { user } = await registerService(body)
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'User registered successfully',
            data: user,
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

        return setAuthenticationCookies({
            res,
            accessToken,
            refreshToken,
        })
            .status(HTTP_STATUS.OK)
            .json({
                message: 'User login successfully',
                mfaRequired,
                user,
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

        return res
            .status(HTTP_STATUS.OK)
            .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
            .json({
                message: 'Refresh access token successfully',
            })
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

// export const googleLoginCallBackController = asyncHandler(
//     async (req: Request, res: Response) => {
//         console.log('googleLoginCallBackController - req.user:', req.user)
//         console.log('googleLoginCallBackController - req.session:', req.session)

//         if (!req.user) {
//             return res.redirect(
//                 `${config.FRONTEND_ORIGIN}/login?error=authentication_failed`
//             )
//         }

//         return res.redirect(`${config.FRONTEND_ORIGIN}/`)
//     }
// )
