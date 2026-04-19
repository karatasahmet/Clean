const express = require('express');
const router = express.Router();
const { Campaign, Coupon } = require('../models');
const { Op } = require('sequelize');
const { logAction } = require('../logger');

// --- CAMPAIGNS ---

// GET all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({ order: [['startDate', 'DESC']] });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET active campaigns for today
router.get('/campaigns/active', async (req, res) => {
  try {
    const today = new Date();
    const campaigns = await Campaign.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          {
            startDate: { [Op.lte]: today },
            endDate: { [Op.gte]: today }
          },
          {
            startDate: null,
            endDate: null
          }
        ]
      }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/campaigns', async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    
    await logAction({
      actionType: 'CAMPAIGN_CREATE',
      description: `Yeni kampanya oluşturuldu: ${campaign.name} (%${campaign.discountPercentage})`,
      details: campaign
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    
    const oldName = campaign.name;
    await campaign.update(req.body);

    await logAction({
      actionType: 'CAMPAIGN_UPDATE',
      description: `Kampanya güncellendi: ${oldName} -> ${campaign.name}`,
      details: req.body
    });

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    
    const name = campaign.name;
    await campaign.destroy();

    await logAction({
      actionType: 'CAMPAIGN_DELETE',
      description: `Kampanya silindi: ${name}`
    });

    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- COUPONS ---

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify coupon code
router.post('/coupons/verify', async (req, res) => {
  try {
    const { code } = req.body;
    const today = new Date();
    const coupon = await Coupon.findOne({
      where: {
        code,
        isActive: true,
        [Op.or]: [
          { expiryDate: { [Op.gte]: today } },
          { expiryDate: null }
        ]
      }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Geçersiz veya süresi dolmuş kupon kodu.' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Bu kuponun kullanım limiti dolmuştur.' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    
    await logAction({
      actionType: 'COUPON_CREATE',
      description: `Yeni indirim kodu oluşturuldu: ${coupon.code} (%${coupon.discountPercentage})`,
      details: coupon
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    
    const oldCode = coupon.code;
    await coupon.update(req.body);

    await logAction({
      actionType: 'COUPON_UPDATE',
      description: `Kupon güncellendi: ${oldCode} -> ${coupon.code}`,
      details: req.body
    });

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    
    const code = coupon.code;
    await coupon.destroy();

    await logAction({
      actionType: 'COUPON_DELETE',
      description: `Kupon silindi: ${code}`
    });

    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
