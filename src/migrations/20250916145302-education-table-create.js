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
        await queryInterface.createTable('educations', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            instructorProfileId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            universityName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            degreeType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            degree: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            cgpa: {
                type: Sequelize.DECIMAL(3, 2),
                allowNull: false,
            },
            startYear: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            endYear: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            transcriptUrl: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('educations')
    },
}
