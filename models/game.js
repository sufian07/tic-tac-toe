'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    name: DataTypes.STRING,
    firstStepper: DataTypes.BOOLEAN,
    currentStepper: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    field1: DataTypes.STRING,
    field2: DataTypes.STRING,
    field3: DataTypes.STRING,
    field4: DataTypes.STRING,
    field5: DataTypes.STRING,
    field6: DataTypes.STRING,
    field7: DataTypes.STRING,
    field8: DataTypes.STRING,
    field9: DataTypes.STRING,
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};
