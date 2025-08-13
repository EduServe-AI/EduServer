import crypto from 'crypto'
import rateLimit from 'express-rate-limit'
import logger from '../utils/logger/logger'

// Auth endpoints rate limiting
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for auth endpoint', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
        })
        res.status(429).json({
            error: 'Too many authentication attempts, please try again later',
        })
    },
})

// Password reset rate limiting
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 password reset requests per hour
    message: 'Too many password reset attempts, please try again later',
    keyGenerator: (req) => {
        const email = req.body?.email as string | undefined
        if (email) {
            return crypto
                .createHash('sha256')
                .update(email.toLowerCase())
                .digest('hex')
        }
        return req.ip || 'unknown'
    },
})

// Magic link rate limiting
export const magicLinkLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 magic link requests per hour
    message: 'Too many magic link requests, please try again later',
    keyGenerator: (req) => {
        const email = req.body?.email as string | undefined
        if (email) {
            return crypto
                .createHash('sha256')
                .update(email.toLowerCase())
                .digest('hex')
        }
        return req.ip || 'unknown'
    },
})

// Email verification rate limiting
export const emailVerificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 verification emails per hour
    message: 'Too many verification email requests, please try again later',
})

// Global rate limiting
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
})
