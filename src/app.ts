import session from 'express-session'
import cors from 'cors'
import express, { Request, Response } from 'express'
import morgan from 'morgan'
import passport from 'passport'
import config from './config/constants'
import './config/passport.config'
import { errorHandler } from './middlewares/errorHandler.middleware'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import isAuthenticated from './middlewares/isAuthenticated.middleware'

const BASE_PATH = config.BASE_PATH

const app = express()

// Handling Cors
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging HTTP requests
// configureSession(app)

app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: config.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax',
        },
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan('dev'))

// Regsitering the routes
app.use(`${BASE_PATH}/auth`, authRoutes)
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes)

app.use(errorHandler)

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Eduserve Backend </h1>')
})

export default app
