// models/skill.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface SkillAttributes {
    id: string
    name: string
    category: string
    isActive: boolean
}

type SkillCreationAttributes = Optional<SkillAttributes, 'id'>

export default class Skill
    extends Model<SkillAttributes, SkillCreationAttributes>
    implements SkillAttributes
{
    declare id: string
    public name!: string
    public category!: string
    public isActive!: boolean
}

Skill.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active',
        },
    },
    {
        sequelize,
        tableName: 'skills',
        modelName: 'Skill',
        underscored: true,
        timestamps: true,
    }
)
