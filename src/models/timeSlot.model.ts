import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface AvailabilityTimeSlotAttributes {
    id: string
    availabilityId: string
    startTime: string // Using string for TIME type - format: 'HH:MM:SS'
    endTime: string // Using string for TIME type - format: 'HH:MM:SS'
    timezone: string
    isActive: boolean
}

type AvailabilityTimeSlotCreationAttributes = Optional<
    AvailabilityTimeSlotAttributes,
    'id' | 'timezone' | 'isActive'
>

export default class AvailabilityTimeSlot
    extends Model<
        AvailabilityTimeSlotAttributes,
        AvailabilityTimeSlotCreationAttributes
    >
    implements AvailabilityTimeSlotAttributes
{
    public id!: string
    public availabilityId!: string
    public startTime!: string
    public endTime!: string
    public timezone!: string
    public isActive!: boolean

    // Association methods
    // public getInstructorAvailability!: () => Promise<InstructorAvailability>
}

AvailabilityTimeSlot.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        availabilityId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'availability_id',
            references: {
                model: 'instructor_availability',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
            field: 'start_time',
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false,
            field: 'end_time',
        },
        timezone: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'UTC',
            validate: {
                // Basic timezone validation - you might want to use a more comprehensive list
                isIn: [
                    [
                        'UTC',
                        'America/New_York',
                        'America/Los_Angeles',
                        'Europe/London',
                        'Asia/Tokyo',
                        'Asia/Kolkata',
                    ],
                ],
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active',
        },
    },
    {
        sequelize,
        modelName: 'AvailabilityTimeSlot',
        tableName: 'availability_time_slots',
        underscored: true,
        validate: {
            // Custom validation to ensure startTime is before endTime
            startBeforeEnd(this: AvailabilityTimeSlot) {
                if (this.startTime >= this.endTime) {
                    throw new Error('Start time must be before end time')
                }
            },
        },
    }
)
