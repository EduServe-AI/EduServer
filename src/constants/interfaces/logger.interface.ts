// src/types/logger.types.ts
export interface LogContext {
    userId?: string
    requestId?: string
    sessionId?: string
    operation?: string
    duration?: number
    statusCode?: number
    method?: string
    url?: string
    userAgent?: string
    ip?: string
    [key: string]: string | number | boolean | undefined
}

export interface Logger {
    error(message: string, context?: LogContext): void
    warn(message: string, context?: LogContext): void
    info(message: string, context?: LogContext): void
    debug(message: string, context?: LogContext): void
    http(message: string, context?: LogContext): void
}
