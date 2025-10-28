'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            picture: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            isEmailVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            userPreferences: {
                type: Sequelize.JSONB,
                defaultValue: {
                    enable2FA: false,
                    emailNotification: true,
                },
            },
            role: {
                type: Sequelize.ENUM('student', 'tutor'),
                allowNull: false,
                defaultValue: 'student',
            },
            googleId: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            onboarded: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users')
    },
}
