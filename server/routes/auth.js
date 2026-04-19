const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { logAction } = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      await logAction({
        actionType: 'LOGIN_FAILED',
        description: `Hatalı giriş denemesi: ${email}`,
        ipAddress: req.ip
      });
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    user.lastLogin = new Date();
    await user.save();

    await logAction({
      userId: user.id,
      userName: user.name,
      actionType: 'LOGIN',
      description: `${user.name} sisteme giriş yaptı.`,
      ipAddress: req.ip
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all users (Personnel Management)
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const user = await User.create({ name, email, password, role, phone });
    
    await logAction({
      actionType: 'USER_CREATE',
      description: `Yeni personel eklendi: ${name} (${role})`,
      details: { name, email, role }
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, phone, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    const oldName = user.name;
    const updateData = { name, email, role, phone };
    if (password) updateData.password = password; // Only update if provided

    await user.update(updateData);

    await logAction({
      actionType: 'USER_UPDATE',
      description: `${oldName} personel bilgileri güncellendi.`,
      details: { name, email, role }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    const name = user.name;
    await user.destroy();

    await logAction({
      actionType: 'USER_DELETE',
      description: `Personel silindi: ${name}`
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Own Profile
router.put('/profile', async (req, res) => {
  const { id, name, email, phone } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    const oldName = user.name;
    await user.update({ name, email, phone });

    await logAction({
      userId: user.id,
      userName: user.name,
      actionType: 'PROFILE_UPDATE',
      description: `${oldName} profil bilgilerini güncelledi.`,
      details: { name, email, phone }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change Own Password
router.put('/change-password', async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Mevcut şifre hatalı.' });
    }

    user.password = newPassword;
    await user.save();

    await logAction({
      userId: user.id,
      userName: user.name,
      actionType: 'PASSWORD_CHANGE',
      description: `${user.name} şifresini değiştirdi.`
    });

    res.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
