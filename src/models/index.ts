import { config } from '../config/app.config'
import { sequelize } from '../config/db.config'
import './session.model'
import './user.model'
import './verification-code.model'

export const syncModels = async () => {
    if (config.NODE_ENV === 'development') {
        console.log('🔄 Syncing Sequelize models (dev only)...')
        await sequelize.sync({ alter: true })
    } else {
        console.log('🚫 Skipping model sync in production')
    }
}
