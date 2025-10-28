import passport, { PassportStatic } from 'passport'
import {
    ExtractJwt,
    Strategy as JwtStrategy,
    StrategyOptionsWithRequest,
} from 'passport-jwt'
import { config } from '../config/app.config'
import { ErrorCode } from '../constants/enums/error-code.enum'
import { findUserById } from '../services/user.service'
import { UnauthorizedException } from './exception/catch-errors'

interface JwtPayload {
    userId: string
    sessionId: string
}

const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            const authHeader = req.headers['authorization']

            if (!authHeader || typeof authHeader !== 'string') {
                throw new UnauthorizedException(
                    'Unauthorized: Authorization header not found',
                    ErrorCode.AUTH_TOKEN_NOT_FOUND
                )
            }

            // Expecting "Bearer <token>"
            const parts = authHeader.split(' ')
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                throw new UnauthorizedException(
                    'Invalid Authorization header format. Format is "Bearer <token>"',
                    ErrorCode.AUTH_INVALID_TOKEN
                )
            }

            const accessToken = parts[1]

            if (!accessToken) {
                throw new UnauthorizedException(
                    'Access token not found in Authorization header',
                    ErrorCode.AUTH_TOKEN_NOT_FOUND
                )
            }

            return accessToken
        },
    ]),
    secretOrKey: config.JWT.SECRET,
    audience: ['user'],
    algorithms: ['HS256'],
    passReqToCallback: true,
}

export const setupJwtStrategy = (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
            try {
                const user = await findUserById(payload.userId)
                if (!user) {
                    return done(null, false)
                }
                req.sessionId = payload.sessionId
                return done(null, user)
            } catch (error) {
                return done(error, false)
            }
        })
    )
}

export const authenticateJWT = passport.authenticate('jwt', { session: false })
