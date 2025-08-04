import session from 'cookie-session'
import { Application } from 'express'
import passport from 'passport'
import config from './constants'

export const configureSession = (app: Application) => {
    // configureSession(app);
    app.use(
        session({
            name: 'session',
            keys: [config.SESSION_SECRET],
            maxAge: 24 * 60 * 60 * 1000,
            secure: config.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())
}
