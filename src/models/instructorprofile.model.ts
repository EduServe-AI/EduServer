// models/instructor.model.ts

import { DataTypes, Model, Optional, Association } from 'sequelize'
import { sequelize } from '../config/db.config'
import type Skill from './skill.model'
import type Language from './language.model'
import type Education from './education.model'
import { pricing_tier } from '../@types/pricing'

interface InstructorAttributes {
    id: string
    instructorId: string // foreignkey referencing id in the users table
    bio: string
    githubUrl: string
    linkedinUrl: string
    basePrice: number
    level: pricing_tier
}

type InstructorCreationAttributes = Optional<
    InstructorAttributes,
    'id' | 'githubUrl' | 'linkedinUrl'
>

export default class InstructorProfiles
    extends Model<InstructorAttributes, InstructorCreationAttributes>
    implements InstructorAttributes
{
    declare id: string
    public instructorId!: string
    public bio!: string
    public githubUrl!: string
    public linkedinUrl!: string
    public basePrice!: number
    public level!: pricing_tier

    // Association properties
    public skills?: Skill[]
    public languages?: Language[]
    public educations?: Education[]

    // Static associations
    public static associations: {
        educations: Association<InstructorProfiles, Education>
        skills: Association<InstructorProfiles, Skill>
        languages: Association<InstructorProfiles, Language>
    }
}

InstructorProfiles.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        instructorId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        githubUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedinUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        basePrice: {
            type: DataTypes.INTEGER,
            defaultValue: 100,
            allowNull: false,
        },
        level: {
            type: DataTypes.ENUM('beginner', 'bronze', 'silver', 'gold'),
            defaultValue: 'beginner',
        },
    },
    {
        sequelize,
        modelName: 'InstructorProfile',
        tableName: 'instructorprofiles',
        timestamps: true,
    }
)
