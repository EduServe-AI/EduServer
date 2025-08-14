import User from '../models/user.model'

export const findUserById = async (userId: string) => {
    const user = await User.findByPk(userId)
    return user || null
}
