import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.config'

class Availability extends Model {
    public id!: string
    public instructorProfileId!: string
    public dayOfWeek!:
        | 'Monday'
        | 'Tuesday'
        | 'Wednesday'
        | 'Thursday'
        | 'Friday'
        | 'Saturday'
        | 'Sunday'
    public startTime!: string
    public endTime!: string
}

Availability.init(
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
        dayOfWeek: {
            type: DataTypes.ENUM(
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ),
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Availability',
        tableName: 'availabilities', // Conventionally plural
    }
)

export default Availability
