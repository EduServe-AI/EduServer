import { Router } from 'express'
import {
    forgotPasswordController,
    googleAuthController,
    googleCallbackController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    resetPasswordController,
    verifyEmailController,
} from '../controllers/auth.controller'
import { authenticateJWT } from '../utils/jwt.strategy'

const authRoutes = Router()

authRoutes.post('/register', registerController)
authRoutes.post('/login', loginController)
authRoutes.post('/verify/email', verifyEmailController)
authRoutes.post('/password/forgot', forgotPasswordController)
authRoutes.post('/password/reset', resetPasswordController)
authRoutes.post('/logout', authenticateJWT, logoutController)

authRoutes.get('/refresh', refreshTokenController)

authRoutes.get('/google', googleAuthController)

authRoutes.get('/google/callback', googleCallbackController)

export default authRoutes
