const express = require('express');
const router = express.Router();
const { ServiceType } = require('../models');
const { logAction } = require('../logger');

// GET all service types
router.get('/', async (req, res) => {
  try {
    const services = await ServiceType.findAll({ order: [['name', 'ASC']] });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new service type
router.post('/', async (req, res) => {
  try {
    const { name, pricePerM2, isActive } = req.body;
    const service = await ServiceType.create({ name, pricePerM2, isActive });
    
    await logAction({
      actionType: 'SERVICE_CREATE',
      description: `Yeni hizmet eklendi: ${service.name} (₺${service.pricePerM2})`,
      details: service
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update service type
router.put('/:id', async (req, res) => {
  try {
    const { name, pricePerM2, isActive } = req.body;
    const service = await ServiceType.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const oldName = service.name;
    const oldPrice = service.pricePerM2;

    if (name !== undefined) service.name = name;
    if (pricePerM2 !== undefined) service.pricePerM2 = pricePerM2;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    await logAction({
      actionType: 'SERVICE_UPDATE',
      description: `Hizmet güncellendi: ${oldName} (₺${oldPrice}) -> ${service.name} (₺${service.pricePerM2})`,
      details: req.body
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE service type
router.delete('/:id', async (req, res) => {
  try {
    const service = await ServiceType.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    
    const name = service.name;
    await service.destroy();

    await logAction({
      actionType: 'SERVICE_DELETE',
      description: `Hizmet silindi: ${name}`
    });

    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
