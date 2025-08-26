'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('verification_codes', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            type: {
                type: Sequelize.ENUM(
                    'EMAIL_VERIFICATION', // adjust names to match your VerificationEnum
                    'PASSWORD_RESET'
                ),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        // Important: Drop enum type before dropping table to avoid errors in Postgres
        await queryInterface.dropTable('verification_codes')
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_verification_codes_type";'
        )
    },
}
