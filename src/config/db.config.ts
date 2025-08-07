import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import { syncModels } from '../models'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
})

export const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('✅ Database connection established successfully')
        await syncModels()
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error)
        process.exit(1)
    }
}
