import { Request } from 'express'
import passport from 'passport'
import {
    Strategy as GoogleStrategy,
    Profile,
    VerifyCallback,
    GoogleCallbackParameters,
} from 'passport-google-oauth20'
import { config } from './app.config'
import {
    findOrCreateUserFromGoogle,
    findUserByEmailOnly,
} from '../services/google-auth.service'

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE.CLIENT_ID,
            clientSecret: config.GOOGLE.CLIENT_SECRET,
            callbackURL: config.GOOGLE.CALLBACK_URL,
            scope: ['profile', 'email'],
            passReqToCallback: true,
        },
        async (
            req: Request,
            _accessToken: string,
            _refreshToken: string,
            _params: GoogleCallbackParameters,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const stateRaw =
                    typeof req.query.state === 'string' ? req.query.state : '{}'
                const state = safeParseState(stateRaw)
                const mode = (state.mode as 'signin' | 'signup') || 'signin'
                const role =
                    (state.userType as 'student' | 'tutor') || 'student'

                const primaryEmail = profile.emails?.[0]?.value
                const displayName =
                    profile.displayName || profile.name?.givenName || 'User'
                const picture = profile.photos?.[0]?.value
                const googleId = profile.id

                if (!primaryEmail) {
                    return done(new Error('Google account has no email'), false)
                }

                if (mode === 'signin') {
                    const existing = await findUserByEmailOnly(primaryEmail)
                    if (!existing) {
                        return done(null, false, {
                            code: 'SIGNUP_REQUIRED',
                            message: 'No account found. Please sign up first.',
                        })
                    }
                    return done(null, existing)
                }

                // signup flow
                const { user } = await findOrCreateUserFromGoogle({
                    email: primaryEmail,
                    name: displayName,
                    googleId,
                    picture,
                    role,
                })
                return done(null, user)
            } catch (error) {
                return done(error as Error, false)
            }
        }
    )
)

function safeParseState(state: string): Record<string, unknown> {
    try {
        return JSON.parse(state)
    } catch {
        return {}
    }
}
