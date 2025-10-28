import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import type { StringValue } from 'ms'
import { config } from '../config/app.config'

export type AccessTPayload = {
    userId: string // UUID from Sequelize User model
    sessionId: string // UUID from Sequelize Session model
}

export type RefreshTPayload = {
    sessionId: string
}

type SignOptsAndSecret = SignOptions & {
    secret: string
}

const signDefaults: SignOptions = {
    audience: 'user',
}

const verifyDefaults: VerifyOptions = {
    audience: 'user',
}

export const accessTokenSignOptions: SignOptsAndSecret = {
    expiresIn: config.JWT.EXPIRES_IN as StringValue,
    secret: config.JWT.SECRET,
}

export const refreshTokenSignOptions: SignOptsAndSecret = {
    expiresIn: config.JWT.REFRESH_EXPIRES_IN as StringValue,
    secret: config.JWT.REFRESH_SECRET,
}

export const signJwtToken = (
    payload: AccessTPayload | RefreshTPayload,
    options?: SignOptsAndSecret
) => {
    const { secret, ...opts } = options || accessTokenSignOptions
    return jwt.sign(payload, secret, {
        ...signDefaults,
        ...opts,
    })
}

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
    token: string,
    options?: VerifyOptions & { secret: string }
) => {
    try {
        const { secret = config.JWT.SECRET, ...opts } = options || {}
        const payload = jwt.verify(token, secret, {
            ...verifyDefaults,
            ...opts,
        }) as unknown as TPayload
        return { payload }
    } catch (err: unknown) {
        return {
            error: (err as Error).message,
        }
    }
}
