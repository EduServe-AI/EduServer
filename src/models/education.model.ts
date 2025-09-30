// models/instructor.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'
import User from './user.model'
import EducationLevel from './educationLevel.model'

interface UserEducationAttributes {
    id: string
    userId: string
    educationLevelId: number
    institutionName: string
    fieldOfStudy: string
    startYear: number
    endYear?: number
    isCurrent: boolean
    gradeOrPercentage?: string
    createdAt?: Date
    updatedAt?: Date
}

type UserEducationCreationAttributes = Optional<
    UserEducationAttributes,
    | 'id'
    | 'endYear'
    | 'isCurrent'
    | 'gradeOrPercentage'
    | 'createdAt'
    | 'updatedAt'
>

export class UserEducation
    extends Model<UserEducationAttributes, UserEducationCreationAttributes>
    implements UserEducationAttributes
{
    public id!: string
    public userId!: string
    public educationLevelId!: number
    public institutionName!: string
    public fieldOfStudy!: string
    public startYear!: number
    public endYear?: number
    public isCurrent!: boolean
    public gradeOrPercentage?: string
    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    // Association methods
    public getUser!: () => Promise<User>
    public getEducationLevel!: () => Promise<EducationLevel>
}

UserEducation.init(
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
                // foreignkey referencing id in the user table
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        educationLevelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'education_level_id',
            references: {
                // foreignkey referencing id in the education level table
                model: 'education_levels',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        institutionName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'institution_name',
        },
        fieldOfStudy: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'field_of_study',
        },
        startYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'start_year',
            validate: {
                min: 1950,
                max: new Date().getFullYear() + 10, // Allow future dates for planned education
            },
        },
        endYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'end_year',
            validate: {
                min: 1950,
                max: new Date().getFullYear() + 10,
            },
        },
        isCurrent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_current',
        },
        gradeOrPercentage: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'grade_or_percentage',
        },
    },
    {
        sequelize,
        modelName: 'UserEducation',
        tableName: 'user_educations',
        underscored: true,
        timestamps: true,
        validate: {
            // Custom validation to ensure endYear is not before startYear
            endYearAfterStart(this: UserEducation) {
                if (this.endYear && this.endYear < this.startYear) {
                    throw new Error('End year cannot be before start year')
                }
            },
            // If not current, must have end year
            currentOrEndYear(this: UserEducation) {
                if (!this.isCurrent && !this.endYear) {
                    throw new Error(
                        'End year is required if education is not current'
                    )
                }
            },
        },
    }
)
