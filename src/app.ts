import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config/app.config'
import asyncHandler from './middlewares/asyncHandler.middleware'
import { errorHandler } from './middlewares/errorHandler.middleware'
import passport from './middlewares/passport.middleware'
import { limiter } from './middlewares/rateLimiter.middleware'
import authRoutes from './routes/auth.routes'
import sessionRoutes from './routes/session.routes'
import onboardingRoutes from './routes/onboarding.routes'
import { authenticateJWT } from './utils/jwt.strategy'

const app = express()

app.use(helmet())
app.use(
    cors({
        origin: ['http://localhost:3000', config.FRONTEND_ORIGIN],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
)
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(passport.initialize())

app.use(morgan('dev'))

// Regsitering the routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/session', authenticateJWT, sessionRoutes)
app.use('/api/v1/onboarding', authenticateJWT, onboardingRoutes)
// app.use('/api/v1/user', userRoutes)

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        res.send('<h1>Eduserve Backend </h1>')
    })
)

// Error handling middleware
app.use(errorHandler)

export default app
