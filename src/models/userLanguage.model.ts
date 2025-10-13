// models/UserLanguage.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'
// import User from './user.model'
// import Language from './language.model'

interface UserLanguageAttributes {
    id: string
    userId: string
    languageId: number
}

type UserLanguageCreationAttributes = Optional<UserLanguageAttributes, 'id'>

export default class UserLanguage
    extends Model<UserLanguageAttributes, UserLanguageCreationAttributes>
    implements UserLanguageAttributes
{
    public id!: string
    public userId!: string
    public languageId!: number
    public readonly createdAt!: Date

    // Association methods
    // public getUser!: () => Promise<User>
    // public getLanguage!: () => Promise<Language>
}

UserLanguage.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        languageId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'language_id',
            references: {
                model: 'languages',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'UserLanguage',
        tableName: 'user_languages',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'language_id'],
            },
        ],
    }
)
