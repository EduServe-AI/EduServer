import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'
// import Skill from './skill.model'
// import User from './user.model'

interface UserSkillAttributes {
    id: string
    userId: string
    skillId: number
    createdAt?: Date
}

type UserSkillCreationAttributes = Optional<
    UserSkillAttributes,
    'id' | 'createdAt'
>

export default class UserSkill
    extends Model<UserSkillAttributes, UserSkillCreationAttributes>
    implements UserSkillAttributes
{
    public id!: string
    public userId!: string
    public skillId!: number

    // Association methods
    // public getUser!: () => Promise<User>
    // public getSkill!: () => Promise<Skill>
}

UserSkill.init(
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
        skillId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'skill_id',
            references: {
                model: 'skills',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'UserSkill',
        tableName: 'user_skills',
        underscored: true,
        updatedAt: false,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'skill_id'],
            },
        ],
    }
)
