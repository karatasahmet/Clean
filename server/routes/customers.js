const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const { logAction } = require('../logger');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [['firstName', 'ASC']] });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new customer
router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    
    await logAction({
      actionType: 'CUSTOMER_CREATE',
      description: `Yeni müşteri eklendi: ${customer.firstName} ${customer.lastName}`,
      details: customer
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    
    const oldName = `${customer.firstName} ${customer.lastName}`;
    await customer.update(req.body);

    await logAction({
      actionType: 'CUSTOMER_UPDATE',
      description: `Müşteri bilgileri güncellendi: ${oldName} -> ${customer.firstName} ${customer.lastName}`,
      details: req.body
    });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    
    const name = `${customer.firstName} ${customer.lastName}`;
    await customer.destroy();

    await logAction({
      actionType: 'CUSTOMER_DELETE',
      description: `Müşteri silindi: ${name}`
    });

    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
