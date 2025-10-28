// models/language.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface LanguageAttributes {
    id: string
    name: string
    instructorProfileId: string
}

type LanguageCreationAttributes = Optional<LanguageAttributes, 'id'>

export default class Language
    extends Model<LanguageAttributes, LanguageCreationAttributes>
    implements LanguageAttributes
{
    declare id: string
    public name!: string
    public instructorProfileId!: string
}

Language.init(
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
        instructorProfileId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'languages',
        modelName: 'language',
        timestamps: true,
    }
)
