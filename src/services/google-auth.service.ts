import { v4 as uuidv4 } from 'uuid'
import User from '../models/user.model'

export const findUserByEmailOnly = async (email: string) => {
    return await User.findOne({ where: { email } })
}

export const findOrCreateUserFromGoogle = async (params: {
    email: string
    name: string
    googleId: string
    picture?: string | null
    role: 'student' | 'tutor'
}) => {
    const existing = await User.findOne({ where: { email: params.email } })
    if (existing) {
        return { user: existing, created: false }
    }
    // Generate a random password placeholder for OAuth accounts
    const randomPassword = uuidv4()
    const user = await User.create({
        name: params.name,
        email: params.email,
        password: randomPassword,
        isEmailVerified: true,
        userPreferences: { enable2FA: false, emailNotification: true },
        role: params.role,
        isVerified: true,
        onboarded: false,
        provider: 'google',
        googleId: params.googleId,
        picture: params.picture || null,
    } as any)
    return { user, created: true }
}
