import app from './app'
import { config } from './config/app.config'
import { connectDatabase } from './config/db.config'
import { populateDaysIfEmpty } from './scripts/populateDays'
import { populateLanguagesIfEmpty } from './scripts/populateLanguages'
import logger from './utils/logger/logger'

// Start server
async function startServer() {
    try {
        await connectDatabase()

        // populating master tables
        await populateLanguagesIfEmpty()
        await populateDaysIfEmpty()

        app.listen(config.PORT, () => {
            logger.info(
                `🚀 Server running on http://localhost:${config.PORT} in ${config.NODE_ENV}`
            )
        })
    } catch (error) {
        logger.error('❌ Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
