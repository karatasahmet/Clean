const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM(
      'Bekliyor', // Talep alındı
      'Alındı',   // Saha personeli adresten aldı
      'Yıkamada', // Tesiste yıkamada
      'Kurumada', // Kurutma odasında
      'Hazır',    // Paketlendi, dağıtıma hazır
      'Teslim Edildi'
    ),
    defaultValue: 'Bekliyor'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  // İlerisi için barkod bilgisi
  barcode: {
    type: DataTypes.STRING,
    allowNull: true, 
    unique: true,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  couponId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

module.exports = Order;
