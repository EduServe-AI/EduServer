import { Router } from 'express'
import passport from 'passport'
import {
    googleLoginCallBackController,
    loginController,
    logoutController,
    registerUserController,
} from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/signup', registerUserController)

authRouter.post('/login', loginController)

authRouter.post('/logout', logoutController)

// authRouter.get(
//     '/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email'],
//         state: JSON.stringify({ userType }), // Pass userType via state
//     })
// )

authRouter.get('/google', (req, res, next) => {
    const userType = req.query.userType

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ userType }),
        // Optional: prompt: 'select_account' to force account selection
    })(req, res, next)
})

authRouter.get('/test', () => console.log('Test route hit'))

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        session: true,
        failureRedirect: '/login',
    }),
    googleLoginCallBackController
)

export default authRouter
