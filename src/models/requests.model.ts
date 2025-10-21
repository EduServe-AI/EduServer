// models/requests.model.ts

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/db.config'

interface RequestAttributes {
    id: string
    title: string
    description: string
    userId: string
    status: 'pending' | 'resolved' | 'accepted' | 'cancelled'
}

type RequestCreationAttributes = Optional<RequestAttributes, 'id'>

export default class Request
    extends Model<RequestAttributes, RequestCreationAttributes>
    implements RequestAttributes
{
    declare id: string
    public title!: string
    public description!: string
    public userId!: string
    public status!: 'pending' | 'resolved' | 'accepted' | 'cancelled'
}

Request.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                'pending',
                'resolved',
                'accepted',
                'cancelled'
            ),
            defaultValue: 'pending',
        },
    },

    {
        sequelize,
        tableName: 'requests',
        modelName: 'Request',
        underscored: true,
        timestamps: true,
    }
)
