const sequelize = require('../database');
const Customer = require('./Customer');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ServiceType = require('./ServiceType');
const Campaign = require('./Campaign');
const Coupon = require('./Coupon');
const User = require('./User');
const ActionLog = require('./ActionLog');

// Associations
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Order.belongsTo(Campaign, { foreignKey: 'campaignId' });
Campaign.hasMany(Order, { foreignKey: 'campaignId' });

Order.belongsTo(Coupon, { foreignKey: 'couponId' });
Coupon.hasMany(Order, { foreignKey: 'couponId' });

// User and Log Associations
User.hasMany(ActionLog, { foreignKey: 'userId' });
ActionLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Customer,
  Order,
  OrderItem,
  ServiceType,
  Campaign,
  Coupon,
  User,
  ActionLog
};
