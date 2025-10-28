import { Request } from 'express'
import passport, { PassportStatic } from 'passport'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import { config } from '../config/app.config'
import User from '../models/user.model'
import { registerWithGoogleService } from '../services/auth.service'
import logger from './logger/logger'
import { generateUniqueCode } from './uuid'

// Create a typed interface to safely extract `state` from query
interface RequestWithQueryState extends Request {
    query: {
        state?: string
    }
}

export const setupGoogleStrategy = (passportInstance: PassportStatic) => {
    passportInstance.use(
        new GoogleStrategy(
            {
                clientID: config.GOOGLE.CLIENT_ID as string,
                clientSecret: config.GOOGLE.CLIENT_SECRET as string,
                callbackURL: config.GOOGLE.CALLBACK_URL as string,
                passReqToCallback: true,
            },
            async (
                req: RequestWithQueryState,
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done
            ) => {
                try {
                    const { userType, authFlow } = JSON.parse(
                        req.query?.state || '{}'
                    )

                    const {
                        name,
                        email,
                        picture,
                        sub: googleId,
                    } = profile._json

                    if (!email) {
                        logger.warn(
                            'Google OAuth: Email not provided by Google profile'
                        )
                        return done(null, false, {
                            message: 'Google account has no public email',
                        })
                    }

                    let user = await User.findOne({ where: { email } })

                    if (!user) {
                        if (authFlow === 'signin') {
                            return done(null, false)
                        }

                        if (authFlow === 'signup') {
                            // Register new user
                            const randomPassword = generateUniqueCode()

                            const fullName = name || 'No name'
                            const safeUserType: 'student' | 'tutor' =
                                userType === 'tutor' ? 'tutor' : 'student'

                            const data = {
                                email,
                                password: randomPassword,
                                name: fullName,
                                picture,
                                googleId,
                                role: safeUserType,
                            }

                            user = await registerWithGoogleService(data)
                        }
                    } else {
                        const currentGoogleId = user.get('googleId')
                        const currentPicture = user.get('picture')

                        if (
                            !currentGoogleId ||
                            currentGoogleId !== googleId ||
                            !currentPicture
                        ) {
                            await User.update(
                                { googleId, picture },
                                { where: { id: user.id } }
                            )
                        }
                    }

                    return done(null, user === null ? undefined : user)
                } catch (error) {
                    logger.error('Google OAuth error:', error)
                    return done(
                        error instanceof Error
                            ? error
                            : new Error('Unknown error'),
                        false
                    )
                }
            }
        )
    )
}

export const authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
})
