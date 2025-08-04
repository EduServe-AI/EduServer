import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../utils/exception/specificErrors'
import { ErrorCodeEnum } from '../utils/exception/errorCodes'

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
        throw new UnauthorizedError({
            message: ErrorCodeEnum.ACCESS_UNAUTHORIZED,
        })
    }
    next()
}

export default isAuthenticated
