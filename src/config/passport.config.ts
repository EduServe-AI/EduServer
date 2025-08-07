import { Request } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'
import {
    loginOrCreateAccountService,
    verifyUserService,
} from '../services/auth.service'
import config from './constants'

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
            passReqToCallback: true,
        },
        async (
            req: Request,
            accessToken: string,
            refreshToken: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile: any,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            done: Function
        ) => {
            try {
                // Get userType from state
                const state = req.query.state
                    ? JSON.parse(req.query.state as string)
                    : {}
                const userType = state.userType
                const { email, name, picture } = profile._json

                const user = await loginOrCreateAccountService({
                    email,
                    username: name,
                    picture: picture,
                    provider: 'google',
                    role: userType,
                })
                done(null, user)
            } catch (error) {
                console.log(error, false)
                return done(error, false)
            }
        }
    )
)

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: true,
        },
        async (email, password, done) => {
            try {
                const user = await verifyUserService({ email, password })
                return done(null, user)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                return done(error, false, { message: error?.message })
            }
        }
    )
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
    done(null, user.id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done) => {
    try {
        const User = (await import('../models/user.model')).default
        const user = await User.findByPk(id)
        done(null, user)
    } catch (error) {
        console.error('Error deserializing user:', error)
        done(error, null)
    }
})
