const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ActionLog = sequelize.define('ActionLog', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null for system actions or failed logins
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  actionType: {
    type: DataTypes.STRING, // e.g., 'LOGIN', 'LOGOUT', 'CREATE_ORDER', 'UPDATE_PRICE'
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true, // createdAt will be our log timestamp
  updatedAt: false
});

module.exports = ActionLog;
