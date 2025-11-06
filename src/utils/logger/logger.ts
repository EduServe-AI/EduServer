import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Detect if running on Vercel (read-only filesystem)
const isVercel = !!process.env.VERCEL

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// Define colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

// Custom format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
)

// ✅ Always include console logging
const transports: winston.transport[] = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),
]

// ✅ Only write logs to files when NOT on Vercel
if (!isVercel) {
    transports.push(
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            handleExceptions: true,
            json: true,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        })
    )

    transports.push(
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            handleExceptions: true,
            json: true,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
        })
    )
}

// ✅ Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format,
    transports,
    exitOnError: false,
})

export default logger
