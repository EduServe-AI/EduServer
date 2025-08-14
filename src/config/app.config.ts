import { getEnv } from '../utils/get-env'

const appConfig = () => ({
    NODE_ENV: getEnv('NODE_ENV'),
    PORT: getEnv('PORT'),
    BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
    DATABASE_URL: getEnv('DATABASE_URL'),
    USE_SSL: getEnv('USE_SSL'),
    JWT: {
        SECRET: getEnv('JWT_SECRET_KEY'),
        EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
        REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
        REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
    },
    MAILER: {
        SMTP_HOST: getEnv('SMTP_HOST'),
        SMTP_PORT: getEnv('SMTP_PORT'),
        SMTP_SECURE: getEnv('SMTP_SECURE'),
        SMTP_USER: getEnv('SMTP_USER'),
        SMTP_PASS: getEnv('SMTP_PASS'),
        FROM_EMAIL: getEnv('FROM_EMAIL'),
    },
    //   MAILER_SENDER: getEnv("MAILER_SENDER"),
    //   RESEND_API_KEY: getEnv("RESEND_API_KEY"),

    GOOGLE: {
        CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
        CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
        CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL'),
    },

    FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN'),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL'),
})

export const config = appConfig()
