import { z } from 'zod'

export const emailSchema = z
    .string()
    .trim()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email too long')

export const passwordSchema = z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters')
//   .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//     "Password must contain at least one uppercase, one lowercase, one number and one special character"
//   );

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name too long'),
    email: emailSchema,
    password: passwordSchema,
})

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})
