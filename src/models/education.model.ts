// models/instructor.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface EducationAttributes {
    id: string
    instructorProfileId: string // foreignkey referencing id in the instructorprofile table
    universityName: string
    degreeType: string
    degree: string
    cgpa: number
    startYear: number
    endYear: number
    transcriptUrl: string
}

// Define which attributes are optional during creation
type EducationCreationAttributes = Optional<EducationAttributes, 'id'>

export default class Education
    extends Model<EducationAttributes, EducationCreationAttributes>
    implements EducationAttributes
{
    declare id: string
    public instructorProfileId!: string
    public universityName!: string
    public degreeType!: string
    public degree!: string
    public cgpa!: number
    public startYear!: number
    public endYear!: number
    public transcriptUrl!: string
}

Education.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        instructorProfileId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        universityName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        degreeType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        degree: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cgpa: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
        },
        startYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        endYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transcriptUrl: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Education',
        tableName: 'educations',
        timestamps: true,
    }
)
