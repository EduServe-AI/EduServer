// models/user.model.ts

import {
    DataTypes,
    Model,
    Optional,
    // Association,
    HasManyGetAssociationsMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasManyAddAssociationMixin,
    HasManyCountAssociationsMixin,
} from 'sequelize'
import { sequelize } from '../config/db.config'
import { compareValue, hashValue } from '../utils/bcrypt'
import InstructorProfiles from './instructorprofile.model'
import UserEducation from './education.model'
import UserSkill from './userSkill.model'
import UserLanguage from './userLanguage.model'
import InstructorAvailability from './instructorAvailability.model'

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
    picture?: string | null
    isEmailVerified: boolean
    userPreferences: UserPreferences
    role: 'student' | 'tutor'
    googleId?: string | null
    isVerified: boolean
    onboarded: boolean
}

type UserCreationAttributes = Optional<
    UserAttributes,
    | 'id'
    | 'isEmailVerified'
    | 'isVerified'
    | 'onboarded'
    | 'googleId'
    | 'picture'
>

export default class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    declare id: string
    declare name: string
    declare email: string
    declare password: string
    declare picture?: string | null
    declare isEmailVerified: boolean
    declare userPreferences: UserPreferences
    declare role: 'student' | 'tutor'
    declare googleId?: string | null
    declare isVerified: boolean
    declare onboarded: boolean

    // 🔐 Password comparison
    async comparePassword(value: string): Promise<boolean> {
        return compareValue(value, this.password)
    }

    // These methods are automatically added by Sequelize because of the 'hasOne' association.
    // By declaring them here, you get full TypeScript support and autocompletion.
    // User <=> InstructorProfile
    public getInstructorProfile!: HasOneGetAssociationMixin<InstructorProfiles>
    public setInstructorProfile!: HasOneSetAssociationMixin<
        InstructorProfiles,
        'id'
    >

    // Association methods for UserEducation (One-to-Many) : User <=> UserEducation
    public getEducations!: HasManyGetAssociationsMixin<UserEducation>
    public addEducation!: HasManyAddAssociationMixin<UserEducation, 'id'>
    public countEducations!: HasManyCountAssociationsMixin

    // Association methods for UserSkill (One-to-Many ) : User <=> UserSkill
    public getUserSkills!: HasManyGetAssociationsMixin<UserSkill>
    public addUserSkills!: HasManyAddAssociationMixin<UserSkill, 'id'>
    public countUserSkills!: HasManyCountAssociationsMixin

    // Association methods for UserLanguages (One-to-Many) : User <=> UserLanguage
    public getUserLanguages!: HasManyGetAssociationsMixin<UserLanguage>
    public addUserLanguages!: HasManyAddAssociationMixin<UserLanguage, 'id'>
    public countUserLanguages!: HasManyCountAssociationsMixin

    // Association methods for UserAvailability (One-to-Many) : User <=> InstructorAvailability
    public getAvailabilities!: HasManyGetAssociationsMixin<InstructorAvailability>
    public addAvailability!: HasManyAddAssociationMixin<
        InstructorAvailability,
        'id'
    >
    public countAvailabilities!: HasManyCountAssociationsMixin

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
        picture: {
            type: DataTypes.STRING,
            allowNull: true,
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
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
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
