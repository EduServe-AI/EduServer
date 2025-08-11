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
import { VerificationEnum } from '../constants/enums/verification-code.enum'
import { generateUniqueCode } from '../utils/uuid'
import User from './user.model' // assuming you have a User model

export interface VerificationCodeAttributes {
    id: string
    userId: string
    code: string
    type: VerificationEnum
    createdAt: Date
    expiresAt: Date
}

export type VerificationCodeCreationAttributes = Optional<
    VerificationCodeAttributes,
    'id' | 'createdAt' | 'code'
>

class VerificationCode
    extends Model<
        InferAttributes<VerificationCode>,
        InferCreationAttributes<VerificationCode>
    >
    implements VerificationCodeAttributes
{
    declare id: string
    declare userId: ForeignKey<User['id']>
    declare code: string
    declare type: VerificationEnum
    declare createdAt: CreationOptional<Date>
    declare expiresAt: Date
}

VerificationCode.init(
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
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: generateUniqueCode,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(VerificationEnum)),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'VerificationCode',
        tableName: 'verification_codes',
        timestamps: false, // you're managing createdAt manually
    }
)

// Associations
VerificationCode.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export default VerificationCode
