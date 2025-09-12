import { config } from '../config/app.config'
import { sequelize } from '../config/db.config'

export const syncModels = async () => {
    if (config.NODE_ENV === 'development') {
        console.info('🔄 Syncing Sequelize models (dev only)...')
        await sequelize.sync({ alter: true })
    } else {
        console.info('🚫 Skipping model sync in production')
    }
}
