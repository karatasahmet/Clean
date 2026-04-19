const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discountPercentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isAutomatic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // If true, applies automatically if date matches
  }
});

module.exports = Campaign;
