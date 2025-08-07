import bcrypt from 'bcrypt'
import User from '../models/user.model'
import {
    BadRequestError,
    UnauthorizedError,
} from '../utils/exception/specificErrors'

export const registerUserService = async (data: {
    username: string
    email: string
    password: string
    userType: 'student' | 'tutor'
}) => {
    const { username, email, password, userType } = data
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
        throw new UnauthorizedError({
            code: 'AUTH_EMAIL_ALREADY_EXISTS',
        })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username: username,
        email,
        picture: null, // No picture provided during registration
        password: hashedPassword,
        role: userType, // Default role
        onboarded: false,
        isVerified: false,
    })

    return { user }
}

export const loginOrCreateAccountService = async (data: {
    provider: string
    picture?: string
    email: string
    username?: string
    role: 'student' | 'tutor'
}) => {
    const { provider, email, picture, username, role } = data
    let user = await User.findOne({ where: { email } })

    if (!user) {
        user = await User.create({
            username: username,
            email,
            password: null, // No password for social login
            picture: picture || null,
            role: role,
            onboarded: false,
            isVerified: provider == 'google' ? true : false, // Assuming social logins are verified
        })
    }
    return user
}

export const verifyUserService = async ({
    email,
    password,
    provider = 'email',
}: {
    email: string
    password?: string
    provider?: string
}) => {
    const user = await User.findOne({ where: { email } })
    try {
        if (!user) {
            throw new BadRequestError({
                code: 'AUTH_USER_NOT_FOUND',
            })
        }
        if (provider === 'email' && user.password && password) {
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            )

            if (!isPasswordValid) {
                throw new UnauthorizedError({
                    code: 'AUTH_INVALID_CREDENTIALS',
                })
            }
        }
        return user
    } catch (error) {
        console.error('Error during user verification:', error)
        throw error
    }
}
