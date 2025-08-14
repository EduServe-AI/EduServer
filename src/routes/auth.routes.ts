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

const authRoutes = Router()

authRoutes.post('/register', registerController)
authRoutes.post('/login', loginController)
authRoutes.post('/verify/email', verifyEmailController)
authRoutes.post('/password/forgot', forgotPasswordController)
authRoutes.post('/password/reset', resetPasswordController)
authRoutes.post('/logout', authenticateJWT, logoutController)

authRoutes.get('/refresh', refreshTokenController)

// authRoutes.get('/google', (req, res, next) => {
//     const userType = req.query.userType

//     passport.authenticate('google', {
//         scope: ['profile', 'email'],
//         state: JSON.stringify({ userType }),
//         // Optional: prompt: 'select_account' to force account selection
//     })(req, res, next)
// })

// authRoutes.get(
//     '/google/callback',
//     passport.authenticate('google', {
//         session: true,
//         failureRedirect: '/login',
//     }),
//     googleLoginCallBackController
// )

export default authRoutes
