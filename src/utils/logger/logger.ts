// src/utils/logger.ts
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

// Custom format for structured logging
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
)

// Define transports
const transports = [
    // Console transport for development
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),

    // Error log file
    new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        handleExceptions: true,
        json: true,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    }),

    // Combined log file
    new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        handleExceptions: true,
        json: true,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
    }),
]

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format,
    transports,
    exitOnError: false,
})

export default logger
