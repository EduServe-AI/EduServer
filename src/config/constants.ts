import dotenv from 'dotenv'
import path from 'path'
import { getEnv } from '../utils/getEnv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })
}

const config = {
    PORT: getEnv('PORT', process.env.PORT),
    NODE_ENV: getEnv('NODE_ENV', process.env.NODE_ENV || 'development'),
    BASE_PATH: getEnv('BASE_PATH', '/api/v1'),

    JWT_SECRET_KEY: getEnv('JWT_SECRET_KEY'),
    JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),

    ACCESS_TOKEN_SECRET: getEnv('ACCESS_TOKEN_SECRET'),
    ACCESS_TOKEN_EXPIRY: getEnv('ACCESS_TOKEN_EXPIRY'),
    REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
    REFRESH_TOKEN_EXPIRY: getEnv('REFRESH_TOKEN_EXPIRY'),

    GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
    GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL'),

    SESSION_SECRET: getEnv('SESSION_SECRET'),
    SESSION_EXPIRES_IN: getEnv('SESSION_EXPIRES_IN'),

    FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN'),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL'),
}

export default config
