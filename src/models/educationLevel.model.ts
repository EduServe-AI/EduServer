import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface EducationLevelAttributes {
    id: number
    level: string // Bachelors , Masters , Phd
    displayOrder: number
}

type EducationLevelCreationAttributes = Optional<EducationLevelAttributes, 'id'>

export default class EducationLevel
    extends Model<EducationLevelAttributes, EducationLevelCreationAttributes>
    implements EducationLevelAttributes
{
    public id!: number
    public level!: string
    public displayOrder!: number
}

EducationLevel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        level: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'display_order',
        },
    },
    {
        sequelize,
        modelName: 'EducationLevel',
        tableName: 'education_levels',
        underscored: true,
        timestamps: false,
    }
)
