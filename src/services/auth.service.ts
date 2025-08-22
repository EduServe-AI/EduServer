import User from '../models/user.model'

import { Op } from 'sequelize'
import { config } from '../config/app.config'
import { ErrorCode } from '../constants/enums/error-code.enum'
import { VerificationEnum } from '../constants/enums/verification-code.enum'
import {
    LoginDto,
    RegisterDto,
    resetPasswordDto,
} from '../constants/interfaces/auth.interface'

import {
    anHourFromNow,
    calculateExpirationDate,
    fortyFiveMinutesFromNow,
    ONE_DAY_IN_MS,
    thirtyDaysFromNow,
    threeMinutesAgo,
} from '../utils/date-time'

import { HTTP_STATUS } from '../config/http.config'
import { sendEmail } from '../mailers/mailer'
import {
    passwordResetTemplate,
    verifyEmailTemplate,
} from '../mailers/templates/template'
import Session from '../models/session.model'
import VerificationCode from '../models/verification-code.model'
import { hashValue } from '../utils/bcrypt'
import { generateUniqueCode } from '../utils/uuid'
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    BadRequestException,
    HttpException,
    InternalServerException,
    NotFoundException,
    UnauthorizedException,
} from '../utils/exception/catch-errors'
import {
    refreshTokenSignOptions,
    RefreshTPayload,
    signJwtToken,
    verifyJwtToken,
} from '../utils/jwt'
import logger from '../utils/logger/logger'

export const registerService = async (registerData: RegisterDto) => {
    const { name, email, password, userType } = registerData

    const existingUser = (await User.count({ where: { email } })) > 0

    if (existingUser) {
        throw new BadRequestException(
            'User already exists with this email',
            ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
        )
    }
    const newUser = await User.create({
        name,
        email,
        password,
        userPreferences: { enable2FA: false, emailNotification: true },
        role: userType,
    })

    const userId = newUser.id

    const verification = await VerificationCode.create({
        userId,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: fortyFiveMinutesFromNow(),
        code: generateUniqueCode(),
    } as any)

    // Sending verification email link
    const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`
    await sendEmail({
        to: newUser.email,
        ...verifyEmailTemplate(verificationUrl),
    })

    return {
        user: newUser,
    }
}

export const loginService = async (loginData: LoginDto) => {
    const { email, password, userAgent } = loginData

    logger.info(`Login attempt for email: ${email}`)
    const user = await User.findOne({
        where: { email },
    })

    if (!user) {
        logger.warn(`Login failed: User with email ${email} not found`)
        throw new BadRequestException(
            'Invalid email or password provided',
            ErrorCode.AUTH_USER_NOT_FOUND
        )
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
        logger.warn(`Login failed: Invalid password for email: ${email}`)
        throw new BadRequestException(
            'Invalid email or password provided',
            ErrorCode.AUTH_USER_NOT_FOUND
        )
    }

    // Check if the user enable 2fa retuen user= null
    if (user.userPreferences.enable2FA) {
        logger.info(`2FA required for user ID: ${user.id}`)
        return {
            user: null,
            mfaRequired: true,
            accessToken: '',
            refreshToken: '',
        }
    }

    logger.info(`Creating session for user ID: ${user.id}`)
    const session = await Session.create({
        userId: user.id,
        userAgent,
        expiredAt: thirtyDaysFromNow(),
    } as any)

    logger.info(`Signing tokens for user ID: ${user.id}`)
    const accessToken = signJwtToken({
        userId: user.id,
        sessionId: session.id,
    })

    const refreshToken = signJwtToken(
        {
            sessionId: session.id,
        },
        refreshTokenSignOptions
    )

    logger.info(`Login successful for user ID: ${user.id}`)
    return {
        user,
        accessToken,
        refreshToken,
        mfaRequired: false,
    }
}

export const refreshTokenService = async (refreshToken: string) => {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
        secret: refreshTokenSignOptions.secret,
    })

    if (!payload) {
        throw new UnauthorizedException('Invalid refresh token')
    }

    const session = await Session.findOne({ where: { id: payload.sessionId } })
    const now = Date.now()

    if (!session) {
        throw new UnauthorizedException('Session does not exist')
    }

    if (session.expiredAt.getTime() <= now) {
        throw new UnauthorizedException('Session expired')
    }

    const sessionRequireRefresh =
        session.expiredAt.getTime() - now <= ONE_DAY_IN_MS

    if (sessionRequireRefresh) {
        session.expiredAt = calculateExpirationDate(
            config.JWT.REFRESH_EXPIRES_IN
        )
        await session.save()
    }

    const newRefreshToken = sessionRequireRefresh
        ? signJwtToken(
              {
                  sessionId: session.id,
              },
              refreshTokenSignOptions
          )
        : undefined

    const accessToken = signJwtToken({
        userId: session.userId,
        sessionId: session.id,
    })

    return {
        accessToken,
        newRefreshToken,
    }
}

export const verifyEmailService = async (code: string) => {
    const validCode = await VerificationCode.findOne({
        where: {
            code: code,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiresAt: {
                [Op.gt]: new Date(),
            },
        },
    })

    if (!validCode) {
        throw new BadRequestException('Invalid or expired verification code')
    }

    const [, [updatedUser]] = await User.update(
        { isEmailVerified: true },
        {
            where: { id: validCode.userId },
            returning: true, // returns updated rows (Postgres only)
        }
    )

    if (!updatedUser) {
        throw new BadRequestException(
            'Unable to verify email address',
            ErrorCode.VALIDATION_ERROR
        )
    }

    await validCode.destroy()
    return {
        user: updatedUser,
    }
}

export const forgotPasswordService = async (email: string) => {
    const user = await User.findOne({
        where: { email },
    })

    if (!user) {
        throw new NotFoundException('User not found')
    }

    //check mail rate limit is 2 emails per 3 or 10 min
    const timeAgo = threeMinutesAgo()
    const maxAttempts = 2

    const count = await VerificationCode.count({
        where: {
            userId: user.id,
            type: VerificationEnum.PASSWORD_RESET,
            createdAt: {
                [Op.gt]: timeAgo,
            },
        },
    })

    if (count >= maxAttempts) {
        throw new HttpException(
            'Too many request, try again later',
            HTTP_STATUS.TOO_MANY_REQUESTS,
            ErrorCode.AUTH_TOO_MANY_ATTEMPTS
        )
    }

    const expiresAt = anHourFromNow()
    const validCode = await VerificationCode.create({
        userId: user.id,
        type: VerificationEnum.PASSWORD_RESET,
        expiresAt,
        code: generateUniqueCode(),
    } as any)

    const resetLink = `${config.FRONTEND_ORIGIN}/reset-password?code=${
        validCode.code
    }&exp=${expiresAt.getTime()}`

    try {
        const emailResult = await sendEmail({
            to: user.email,
            ...passwordResetTemplate(resetLink),
        })

        if (!emailResult?.messageId) {
            throw new InternalServerException('Failed to send email')
        }
    } catch (emailError: unknown) {
        logger.error('Failed to send password reset email:', emailError)
        throw new InternalServerException(
            `Failed to send email: ${(emailError as Error)?.message || 'Unknown error'}`
        )
    }

    return {
        url: resetLink,
        message: 'Password reset email sent successfully',
    }
}

export const resePasswordService = async ({
    password,
    verificationCode,
}: resetPasswordDto) => {
    const validCode = await VerificationCode.findOne({
        where: {
            code: verificationCode,
            type: VerificationEnum.PASSWORD_RESET,
            expiresAt: {
                [Op.gt]: new Date(),
            },
        },
    })

    if (!validCode) {
        throw new NotFoundException('Invalid or expired verification code')
    }

    const hashedPassword = await hashValue(password)

    const [, [updatedUser]] = await User.update(
        { password: hashedPassword },
        {
            where: { id: validCode.userId },
            returning: true, // Postgres only
        }
    )

    if (!updatedUser) {
        throw new BadRequestException('Failed to reset password!')
    }

    // Delete the validCode instance
    await validCode.destroy()

    // Delete all sessions where userId matches updatedUser.id
    await Session.destroy({
        where: {
            userId: updatedUser.id, // Sequelize uses `id` instead of `_id`
        },
    })

    return {
        user: updatedUser,
    }
}

export const logoutService = async (sessionId: string) => {
    return await Session.destroy({
        where: { id: sessionId },
    })
}

export const registerWithGoogleService = async (data: {
    picture?: string
    email: string
    name: string
    role: 'student' | 'tutor'
    password: string
    googleId: string
}) => {
    const { email, picture, password, name, role, googleId } = data
    // let user = await User.findOne({ where: { email } })

    const user = await User.create({
        name,
        email,
        password, // No password for social login
        picture: picture || null,
        role,
        googleId,
        onboarded: false,
        isVerified: true, // Assuming social logins are verified
        userPreferences: { enable2FA: false, emailNotification: true },
    })
    return user
}

export const loginWithGoogleService = async (
    userId: string,
    userAgent?: string
) => {
    logger.info(`Creating session for user ID: ${userId}`)
    const session = await Session.create({
        userId,
        userAgent,
        expiredAt: thirtyDaysFromNow(),
    } as any)

    logger.info(`Signing tokens for user ID: ${userId}`)
    const accessToken = signJwtToken({
        userId,
        sessionId: session.id,
    })

    const refreshToken = signJwtToken(
        {
            sessionId: session.id,
        },
        refreshTokenSignOptions
    )

    return { accessToken, refreshToken }
}

// export const verifyUserService = async ({
//     email,
//     password,
//     provider = 'email',
// }: {
//     email: string
//     password?: string
//     provider?: string
// }) => {
//     const user = await User.findOne({ where: { email } })
//     try {
//         if (!user) {
//             throw new BadRequestException('AUTH_USER_NOT_FOUND')
//         }
//         if (provider === 'email' && user.password && password) {
//             const isPasswordValid = await bcrypt.compare(
//                 password,
//                 user.password
//             )

//             if (!isPasswordValid) {
//                 throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS')
//             }
//         }
//         return user
//     } catch (error) {
//         console.error('Error during user verification:', error)
//         throw error
//     }
// }
