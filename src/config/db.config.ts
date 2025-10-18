// config/db.config.ts - Alternative approach

import { Sequelize } from 'sequelize'
import { config } from './app.config'
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
        // Test database connection
        await sequelize.authenticate()
        logger.info('✅ Database connection established successfully')

        // Import models directly - avoiding potential circular dependency
        logger.info('🔧 Importing and initializing models...')

        // Import all models to ensure they're registered
        await import('../models/session.model')
        await import('../models/user.model')
        await import('../models/verification-code.model')
        await import('../models/instructorprofile.model')

        // importing the master tables
        await import('../models/educationLevel.model')
        await import('../models/skill.model')
        await import('../models/language.model')
        await import('../models/dayofWeek.model')

        // importing the junction tables
        await import('../models/education.model') // --- > UserEducation
        await import('../models/userSkill.model') // --- > UserSkill
        await import('../models/userLanguage.model') // --- > UserLanguage
        await import('../models/instructorAvailability.model') // --- > InstructorAvailability
        await import('../models/timeSlot.model') // --- > TimeSlot

        // await import('../models/availability.model')

        logger.info('✅ Models imported successfully')

        // Set up associations
        const { setUpAssociations } = await import('../models/associations')

        setUpAssociations()

        logger.info('✅ Model associations established successfully')

        // Sync models in development
        if (config.NODE_ENV === 'development') {
            logger.info('🔄 Syncing Sequelize models (dev only)...')
            await sequelize.sync({ alter: true })
            logger.info('✅ Database models synchronized successfully')
        } else {
            logger.info('🚫 Skipping model sync in production')
        }

        logger.info('✅ Database setup completed successfully')
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error)
        process.exit(1)
    }
}
