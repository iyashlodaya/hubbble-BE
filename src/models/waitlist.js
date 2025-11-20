'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Waitlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Waitlist.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'contacted'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    tableName: 'waitlist_entries',
    modelName: 'Waitlist',
  });
  return Waitlist;
};