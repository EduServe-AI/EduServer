import bcrypt from 'bcrypt'
import User from '../models/user.model'
import {
    BadRequestError,
    UnauthorizedError,
} from '../utils/errors/specificErrors'

export const registerUserService = async (data: {
    name: string
    email: string
    password: string
}) => {
    try {
        const { name, email, password } = data
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            throw new BadRequestError({
                code: 'AUTH_EMAIL_ALREADY_EXISTS',
            })
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username: name,
            email,
            picture: null, // No picture provided during registration
            password: hashedPassword,
            role: 'student', // Default role
            onboarded: false,
            isVerified: false,
        })

        return user
    } catch (error) {
        console.error('Error during user registration:', error)
        throw error
    }
}

export const loginOrCreateAccountService = async (data: {
    provider: string
    picture?: string
    email: string
    username?: string
}) => {
    const { provider, email, picture, username } = data
    let user = await User.findOne({ where: { email } })

    try {
        if (!user) {
            user = await User.create({
                username: username,
                email,
                password: null, // No password for social login
                picture: picture || null,
                role: 'student',
                onboarded: false,
                isVerified: provider == 'google' ? true : false, // Assuming social logins are verified
            })
        }
        return user
    } catch (error) {
        console.error('Error during login or account creation:', error)
        throw error
    }
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
