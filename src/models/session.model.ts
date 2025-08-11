import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Optional,
} from 'sequelize'
import { sequelize } from '../config/db.config'
import { thirtyDaysFromNow } from '../utils/date-time'
import User from './user.model' // your User model

export interface SessionAttributes {
    id: string
    userId: string
    userAgent?: string
    createdAt: Date
    expiredAt: Date
}

export type SessionCreationAttributes = Optional<
    SessionAttributes,
    'id' | 'createdAt' | 'userAgent' | 'expiredAt'
>

class Session
    extends Model<InferAttributes<Session>, InferCreationAttributes<Session>>
    implements SessionAttributes
{
    declare id: string
    declare userId: ForeignKey<User['id']>
    declare userAgent?: string
    declare createdAt: CreationOptional<Date>
    declare expiredAt: Date
}

Session.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: thirtyDaysFromNow,
        },
    },
    {
        sequelize,
        modelName: 'Session',
        tableName: 'sessions',
        timestamps: false, // because you're managing createdAt manually
    }
)

// Optional: define associations
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export default Session
