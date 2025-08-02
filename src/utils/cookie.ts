import { Response } from 'express'
import config from '../config/constants'

export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        // domain: config.COOKIE_DOMAIN,
        path: '/refresh-token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict',
    })
}
export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        // domain: config.COOKIE_DOMAIN,
        path: '/refresh-token',
        sameSite: 'strict',
    })
}
