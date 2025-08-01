export interface UserAttributes {
    id: string
    username: string | null
    email: string
    password: string | null
    picture: string | null
    role: 'student' | 'instructor'
    isVerified: boolean
    onboarded: boolean
    createdAt?: Date
    updatedAt?: Date
}
