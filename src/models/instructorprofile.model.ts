// models/instructor.model.ts

import {
    DataTypes,
    Model,
    Optional,
    Association,
    BelongsToGetAssociationMixin,
} from 'sequelize'
import { sequelize } from '../config/db.config'
import type Skill from './skill.model'
import type Language from './language.model'
import type UserEducation from './education.model'
import type User from './user.model'
import { pricing_tier } from '../@types/pricing'

interface InstructorAttributes {
    id: string
    userId: string // foreignkey referencing id in the users table
    bio: string
    githubUrl?: string
    linkedinUrl?: string
    basePrice: number
    level: pricing_tier
    isProfileComplete: boolean
    isApproved: boolean
    approvalDate?: Date
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
    public userId!: string
    public bio!: string
    public githubUrl!: string
    public linkedinUrl!: string
    public basePrice!: number
    public level!: pricing_tier
    public isProfileComplete!: boolean
    public isApproved!: boolean
    public approvalDate?: Date

    // Automatic assosications methods provided by sequelize
    public getUser!: BelongsToGetAssociationMixin<User>

    // Association properties
    public skills?: Skill[]
    public languages?: Language[]
    public educations?: UserEducation[]

    // Static associations
    public static associations: {
        educations: Association<InstructorProfiles, UserEducation>
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
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            field: 'user_id',
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        githubUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'github_url',
            validate: {
                isUrl: true,
            },
        },
        linkedinUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'linkedin_url',
            validate: {
                isUrl: true,
            },
        },
        basePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            field: 'base_price',
            validate: {
                min: 0,
            },
        },
        isProfileComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_profile_complete',
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_approved',
        },
        approvalDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'approval_date',
        },
        level: {
            type: DataTypes.ENUM('beginner', 'bronze', 'silver', 'gold'),
            defaultValue: 'beginner',
        },
    },
    {
        sequelize,
        modelName: 'InstructorProfile',
        tableName: 'instructor_profiles',
        timestamps: true,
        underscored: true,
    }
)
