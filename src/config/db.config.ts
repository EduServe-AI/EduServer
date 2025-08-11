// utils/database.ts

import { Sequelize } from 'sequelize'
import { config } from '../config/app.config'
import logger from '../utils/logger/logger'

const useSSL = config.NODE_ENV === 'production' || config.USE_SSL === 'true'

export const sequelize = new Sequelize(config.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSSL
        ? {
              ssl: {
                  require: true,
                  rejectUnauthorized: false,
              },
          }
        : undefined,
})

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate()
        logger.info('✅ Database connection established successfully')

        // Import and sync models after sequelize is authenticated
        const { syncModels } = await import('../models')
        await syncModels()
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error)
        process.exit(1)
    }
}
