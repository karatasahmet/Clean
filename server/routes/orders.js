const express = require('express');
const router = express.Router();
const { Order, Customer, OrderItem, ServiceType, Campaign, Coupon } = require('../models');
const { logAction } = require('../logger');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [Customer, OrderItem, Campaign, Coupon],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [Customer, OrderItem, Campaign, Coupon]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    await logAction({
      actionType: 'ORDER_CREATE',
      description: `Yeni sipariş oluşturuldu: #${order.id}`,
      details: order
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const oldStatus = order.status;
    await order.update(req.body);

    if (req.body.status && req.body.status !== oldStatus) {
      await logAction({
        actionType: 'ORDER_STATUS_CHANGE',
        description: `Sipariş #${order.id} durumu değişti: ${oldStatus} -> ${req.body.status}`,
        details: { orderId: order.id, oldStatus, newStatus: req.body.status }
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add item to order
router.post('/:id/items', async (req, res) => {
  try {
    const { type, width, length, quantity, squareMeters, unitPrice } = req.body;
    const item = await OrderItem.create({
      orderId: req.params.id,
      type,
      width,
      length,
      quantity,
      squareMeters,
      unitPrice: unitPrice || 0,
      barcode: `BRC-${Date.now()}-${Math.floor(Math.random()*1000)}`
    });

    await logAction({
      actionType: 'ORDER_ITEM_ADD',
      description: `Sipariş #${req.params.id} için yeni ürün eklendi: ${type} (${squareMeters} m²)`,
      details: item
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
