import { ErrorRequestHandler, Response } from 'express'
import z from 'zod'
import { HTTP_STATUS } from '../config/http.config'
import { clearAuthenticationCookies, REFRESH_PATH } from '../utils/cookie'
import { AppError } from '../utils/exception/appError'
import logger from '../utils/logger/logger'

const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }))
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors,
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    })

    // // Database errors
    // if (err.code === "23505") {
    //   // Unique constraint violation
    //   return res.status(409).json({
    //     error: "Resource already exists",
    //   });
    // }

    // if (err.code === "23503") {
    //   // Foreign key constraint violation
    //   return res.status(400).json({
    //     error: "Invalid reference",
    //   });
    // }

    if (err instanceof SyntaxError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: 'Invalid JSON format, please check your request body',
        })
    }

    if (req.path === REFRESH_PATH) {
        clearAuthenticationCookies(res)
    }

    // Validation errors
    if (err instanceof z.ZodError) {
        return formatZodError(res, err)
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode,
        })
    }

    // Default error
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err?.message || 'Unknown error occurred',
    })
}
