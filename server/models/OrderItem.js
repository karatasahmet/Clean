const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Makine Halısı' // Makine, Yün, Shaggy vb.
  },
  width: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  length: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  squareMeters: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  }
});

module.exports = OrderItem;
