import { Router } from 'express'
import {
    forgotPasswordController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    resetPasswordController,
    verifyEmailController,
} from '../controllers/auth.controller'
import { authenticateJWT } from '../utils/jwt.strategy'
import passport from '../middlewares/passport.middleware'
import { config } from '../config/app.config'
import { createSessionAndTokensForUser } from '../services/auth.service'
import { setAuthenticationCookies } from '../utils/cookie'

const authRoutes = Router()

authRoutes.post('/register', registerController)
authRoutes.post('/login', loginController)
authRoutes.post('/verify/email', verifyEmailController)
authRoutes.post('/password/forgot', forgotPasswordController)
authRoutes.post('/password/reset', resetPasswordController)
authRoutes.post('/logout', authenticateJWT, logoutController)

authRoutes.get('/refresh', refreshTokenController)

authRoutes.get('/google', (req, res, next) => {
    const mode = (req.query.mode as string) || 'signin' // 'signin' | 'signup'
    const userType = (req.query.userType as string) || 'student'

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ mode, userType }),
        prompt: 'select_account',
    })(req, res, next)
})

authRoutes.get('/google/callback', (req, res, next) => {
    passport.authenticate(
        'google',
        { session: false },
        async (err, user: Express.User | false, info) => {
            if (err || !user) {
                const errorCode = (info as any)?.code || 'AUTH_FAILED'
                const errorMessage =
                    (info as any)?.message || 'Google authentication failed'
                const redirectUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?success=false&code=${encodeURIComponent(errorCode)}&message=${encodeURIComponent(errorMessage)}`
                return res.redirect(redirectUrl)
            }

            try {
                const userAgent = req.headers['user-agent']
                const { accessToken, refreshToken } =
                    await createSessionAndTokensForUser({
                        userId: user.id,
                        userAgent,
                    })

                setAuthenticationCookies({ res, accessToken, refreshToken })
                const redirectUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?success=true`
                return res.redirect(redirectUrl)
            } catch (tokenErr) {
                const redirectUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?success=false&code=TOKEN_ISSUE_FAILED`
                return res.redirect(redirectUrl)
            }
        }
    )(req, res, next)
})

export default authRoutes
