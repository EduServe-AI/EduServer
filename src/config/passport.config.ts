import bcrypt from 'bcrypt'
import { Request } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'
import { loginOrCreateAccountService } from '../services/auth.service'
import { findUserByEmail } from '../services/user.service'
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
                const { email, name, picture } = profile._json

                const user = await loginOrCreateAccountService({
                    email,
                    username: name,
                    picture: picture,
                    provider: 'google',
                })
                done(null, user)
            } catch (error) {
                console.log(error, false)
            }
        }
    )
)

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password', session: true },
        async (email, password, done) => {
            try {
                const user = await findUserByEmail(email)
                if (!user) {
                    return done(null, false, { message: 'User not found' })
                }

                // Check if password exists and compare
                if (!user.password) {
                    return done(null, false, {
                        message: 'Invalid email or password',
                    })
                }
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                )
                if (!isPasswordValid) {
                    return done(null, false, {
                        message: 'Invalid email or password',
                    })
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    )
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => done(null, user))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser((user: any, done) => done(null, user))
