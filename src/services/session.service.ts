import { Op } from 'sequelize'
import Session from '../models/session.model'
import User from '../models/user.model'
import { NotFoundException } from '../utils/exception/catch-errors'

export const getAllSessionService = async (userId: string) => {
    const sessions = await Session.findAll({
        where: {
            userId,
            expiredAt: {
                [Op.gt]: new Date(), // equivalent to $gt
            },
        },
        attributes: ['id', 'userId', 'userAgent', 'createdAt', 'expiredAt'],
        order: [['createdAt', 'DESC']],
    })

    return {
        sessions,
    }
}

export const getSessionByIdService = async (sessionId: string) => {
    const session = await Session.findByPk(sessionId, {
        attributes: {
            exclude: ['expiredAt'], // same as .select("-expiresAt")
        },
        include: [
            {
                model: User,
                as: 'user', // alias must match your association
                attributes: { exclude: ['password'] }, // optional: remove sensitive user fields
            },
        ],
    })

    if (!session) {
        throw new NotFoundException('Session not found')
    }

    const { user } = session as Session & { user: User }

    return {
        user,
    }
}

export const deleteSessionService = async (
    sessionId: string,
    userId: string
) => {
    const deletedSession = await Session.destroy({
        where: {
            id: sessionId,
            userId: userId,
        },
    })
    if (!deletedSession) {
        throw new NotFoundException('Session not found')
    }
    return
}
