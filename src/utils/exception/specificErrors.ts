import z from 'zod'
import { HTTP_STATUS } from '../../config/http.config'
import { AppError } from './appError'
import { ErrorCodeEnum, ErrorCodeEnumType } from './errorCodes'

/**
 * Predefined Error Classes for Common Scenarios
 *
 * Provides convenient error classes for common HTTP error scenarios.
 */
export class BadRequestError extends AppError {
    constructor(params?: {
        code?: ErrorCodeEnumType
        message?: string
        details?: unknown
    }) {
        super({
            code: params?.code || ErrorCodeEnum.VALIDATION_ERROR,
            message: params?.message,
            details: params?.details,
            overrideMetadata: { statusCode: HTTP_STATUS.BAD_REQUEST },
        })
    }
}

export class UnauthorizedError extends AppError {
    constructor(params?: {
        code?: ErrorCodeEnumType
        message?: string
        details?: unknown
    }) {
        super({
            code: params?.code || ErrorCodeEnum.AUTH_INVALID_CREDENTIALS,
            message: params?.message,
            details: params?.details,
            overrideMetadata: { statusCode: HTTP_STATUS.UNAUTHORIZED },
        })
    }
}

export class ForbiddenError extends AppError {
    constructor(params?: {
        code?: ErrorCodeEnumType
        message?: string
        details?: unknown
    }) {
        super({
            code: params?.code || ErrorCodeEnum.ACCESS_FORBIDDEN,
            message: params?.message,
            details: params?.details,
            overrideMetadata: { statusCode: HTTP_STATUS.FORBIDDEN },
        })
    }
}

export class NotFoundError extends AppError {
    constructor(params?: {
        code?: ErrorCodeEnumType
        message?: string
        details?: unknown
    }) {
        super({
            code: params?.code || ErrorCodeEnum.RESOURCE_NOT_FOUND,
            message: params?.message,
            details: params?.details,
            overrideMetadata: { statusCode: HTTP_STATUS.NOT_FOUND },
        })
    }
}

export class InternalServerError extends AppError {
    constructor(params?: {
        code?: ErrorCodeEnumType
        message?: string
        details?: unknown
    }) {
        super({
            code: params?.code || ErrorCodeEnum.INTERNAL_SERVER_ERROR,
            message: params?.message,
            details: params?.details,
            overrideMetadata: { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR },
        })
    }
}

/**
 * Syntax Error - For malformed requests
 */
export class SyntaxError extends AppError {
    constructor(message = 'Syntax error in request', details?: unknown) {
        super({
            code: ErrorCodeEnum.SYNTAX_ERROR,
            message,
            details,
            overrideMetadata: {
                statusCode: HTTP_STATUS.BAD_REQUEST,
                category: 'validation',
            },
        })
    }
}

/**
 * Zod Validation Error - For Zod schema validation failures
 */
export class ZodValidationError extends AppError {
    constructor(zodError: z.ZodError, message = 'Validation failed') {
        const details = zodError.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
        }))

        super({
            code: ErrorCodeEnum.VALIDATION_ERROR,
            message,
            details,
            overrideMetadata: {
                statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                category: 'validation',
            },
        })
    }
}

/**
 * JSON Parse Error - For invalid JSON payloads
 */
export class JsonParseError extends AppError {
    constructor(error: SyntaxError, message = 'Invalid JSON payload') {
        super({
            code: ErrorCodeEnum.JSON_PARSE_ERROR,
            message,
            details: {
                position: error.message.match(/at position (\d+)/)?.[1],
                rawMessage: error.message,
            },
            overrideMetadata: {
                statusCode: HTTP_STATUS.BAD_REQUEST,
                category: 'validation',
            },
        })
    }
}
