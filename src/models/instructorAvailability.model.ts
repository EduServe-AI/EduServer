// models/InstructorAvailability.ts
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'
// import User from './user.model'
// import DayOfWeek from './dayofWeek.model'

interface InstructorAvailabilityAttributes {
    id: string
    userId: string
    dayOfWeekId: number
    isAvailable: boolean
}

type InstructorAvailabilityCreationAttributes = Optional<
    InstructorAvailabilityAttributes,
    'id' | 'isAvailable'
>

export default class InstructorAvailability
    extends Model<
        InstructorAvailabilityAttributes,
        InstructorAvailabilityCreationAttributes
    >
    implements InstructorAvailabilityAttributes
{
    public id!: string
    public userId!: string
    public dayOfWeekId!: number
    public isAvailable!: boolean

    // Association methods
    // public getInstructor!: () => Promise<User>
    // public getDayOfWeek!: () => Promise<DayOfWeek>
    // public getAvailabilityTimeSlots!: () => Promise<AvailabilityTimeSlot[]>
}

InstructorAvailability.init(
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
        dayOfWeekId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'day_of_week_id',
            references: {
                model: 'days_of_week',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_available',
        },
    },
    {
        sequelize,
        modelName: 'InstructorAvailability',
        tableName: 'instructor_availability',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['instructor_id', 'day_of_week_id'],
            },
        ],
    }
)
