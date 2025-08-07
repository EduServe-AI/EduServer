import User from '../models/user.model'
import { NotFoundError } from '../utils/exception/specificErrors'
import { ErrorCodeEnum } from '../utils/exception/errorCodes'

export const findUserByEmail = async (email: string) => {
    return await User.findOne({ where: { email } })
}

export const getCurrentUserService = async (userId: string) => {
    const user = await User.findByPk(userId, {
        attributes: {
            exclude: ['password'],
        },
    })

    if (!user) {
        throw new NotFoundError({ message: ErrorCodeEnum.AUTH_USER_NOT_FOUND })
    }

    return {
        user,
    }
}
