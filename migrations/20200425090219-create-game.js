'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Games', {
      id: {
        allownull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      odd1: {
        type: Sequelize.INTEGER
      },
      odd2: {
        type: Sequelize.INTEGER
      },
      firstStepper: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      currentStepper: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'accepted', 'started', 'resigned', 'completed'],
        defaultValue: 'pending',
      },
      field1: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field2: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field3: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field4: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field5: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field6: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field7: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field8: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      field9: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      createdAt: {
        allownull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allownull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Games');
  }
};
