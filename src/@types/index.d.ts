//no-unused-vars
import { Request } from 'express'
import User from '../models/user.model'

type _FixImports = Request | User

declare global {
    namespace Express {
        interface User extends User {
            id: string
        }
        interface Request {
            sessionId?: string
        }
    }
}
