import jwt, { SignOptions } from 'jsonwebtoken'
import config from '../config/constants'
import { UnauthorizedError } from './errors/specificErrors'

export type TokenTypes = 'access' | 'refresh'

const secretKey = (type: TokenTypes) =>
    type === 'access' ? config.ACCESS_TOKEN_SECRET : config.REFRESH_TOKEN_SECRET

const expiry = (type: TokenTypes) =>
    type === 'access' ? config.ACCESS_TOKEN_EXPIRY : config.REFRESH_TOKEN_EXPIRY

export const generateToken = (
    userId: string,
    role: string,
    type: TokenTypes
) => {
    const payload = { userId, role }
    const options: SignOptions = {
        expiresIn: expiry(type) as jwt.SignOptions['expiresIn'],
    }

    return jwt.sign(payload, secretKey(type) as jwt.Secret, options)
}

export const verifyToken = async (
    token: string,
    type: TokenTypes
): Promise<jwt.JwtPayload> => {
    try {
        const payload = jwt.verify(token, secretKey(type)) as jwt.JwtPayload
        if (payload.type !== type) {
            throw new UnauthorizedError({
                code: 'AUTH_TOKEN_INVALID',
            })
        }
        return payload
    } catch (error) {
        console.error('Error verifying token:', error)
        throw error
    }
}
