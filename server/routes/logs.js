const express = require('express');
const router = express.Router();
const { ActionLog } = require('../models');

// GET all activity logs
router.get('/activity', async (req, res) => {
  try {
    const logs = await ActionLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100 // Last 100 actions
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
