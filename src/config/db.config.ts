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
        // const { syncModels } = await import('../models')
        // await syncModels()
        // commented out this code to fix circular dependency issue

        // Import models AFTER sequelize is authenticated and ready
        // This ensures the sequelize instance is available when models initialize
        await import('../models/session.model')
        await import('../models/user.model')
        await import('../models/verification-code.model')

        // syncing the models after sequelize is authenticated
        if (config.NODE_ENV === 'development') {
            console.info('🔄 Syncing Sequelize models (dev only)...')
            await sequelize.sync({ alter: true })
        } else {
            console.info('🚫 Skipping model sync in production')
        }
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error)
        process.exit(1)
    }
}
