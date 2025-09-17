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
        await queryInterface.createTable('availabilities', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            instructorProfileId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            dayOfWeek: {
                type: Sequelize.ENUM(
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ),
                allowNull: false,
            },
            startTime: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            endTime: {
                type: Sequelize.TIME,
                allowNull: false,
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
        await queryInterface.dropTable('availabilities')
    },
}
