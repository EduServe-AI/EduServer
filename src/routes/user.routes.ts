import { Router } from 'express'
import { getCurrentUserController } from '../controllers/user.Controller'

const userRoutes = Router()

userRoutes.get('/current', getCurrentUserController)

userRoutes.get('/test', () => console.log('test log'))

export default userRoutes
