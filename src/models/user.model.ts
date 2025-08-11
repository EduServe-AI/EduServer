// models/user.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'
import { compareValue, hashValue } from '../utils/bcrypt'

interface UserPreferences {
    enable2FA: boolean
    emailNotification: boolean
    twoFactorSecret?: string
}

interface UserAttributes {
    id: string
    name: string
    email: string
    password: string
    isEmailVerified: boolean
    userPreferences: UserPreferences
    role: 'student' | 'tutor'
    isVerified: boolean
    onboarded: boolean
}

type UserCreationAttributes = Optional<
    UserAttributes,
    'id' | 'isEmailVerified' | 'isVerified' | 'onboarded'
>

export default class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    declare id: string
    declare name: string
    declare email: string
    declare password: string
    declare isEmailVerified: boolean
    declare userPreferences: UserPreferences
    declare role: 'student' | 'tutor'
    declare isVerified: boolean
    declare onboarded: boolean

    // 🔐 Password comparison
    async comparePassword(value: string): Promise<boolean> {
        return compareValue(value, this.password)
    }

    // 🔍 Hide sensitive fields when converting to JSON
    toJSON() {
        const values = { ...this.get() } as Record<string, unknown>
        delete values.password
        if (values.userPreferences) {
            delete (values.userPreferences as Record<string, unknown>)
                .twoFactorSecret
        }
        return values
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        userPreferences: {
            type: DataTypes.JSONB,
            defaultValue: {
                enable2FA: false,
                emailNotification: true,
            },
        },
        role: {
            type: DataTypes.ENUM('student', 'tutor'),
            allowNull: false,
            defaultValue: 'student',
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        onboarded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeSave: async (user: User) => {
                if (user.changed('password')) {
                    user.password = await hashValue(user.password)
                }
            },
        },
    }
)
