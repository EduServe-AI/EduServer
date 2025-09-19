// models/skill.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface SkillAttributes {
    id: string
    name: string
    instructorProfileId: string
}

type SkillCreationAttributes = Optional<SkillAttributes, 'id'>

export default class Skill
    extends Model<SkillAttributes, SkillCreationAttributes>
    implements SkillAttributes
{
    declare id: string
    public name!: string
    public instructorProfileId!: string
}

Skill.init(
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
        tableName: 'skills',
        modelName: 'Skill',
        timestamps: true,
    }
)
