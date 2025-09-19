'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('instructorprofiles', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            instructorId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            bio: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            githubUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            linkedinUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            basePrice: {
                type: Sequelize.INTEGER,
                defaultValue: 100,
                allowNull: false,
            },
            level: {
                type: Sequelize.ENUM('beginner', 'bronze', 'silver', 'gold'),
                defaultValue: 'beginner',
            },
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('instructorprofiles')
    },
}
