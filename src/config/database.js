require('dotenv').config()

module.exports = {
    development: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
    },
    staging: {
        use_env_variable: 'STAGING_DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true,
            },
        },
    },
    production: {
        use_env_variable: 'PRODUCTION_DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true,
            },
        },
    },
}
