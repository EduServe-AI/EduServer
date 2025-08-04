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

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends UserAttributes {}
    }
}
