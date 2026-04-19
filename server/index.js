const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { sequelize } = require('./models');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const serviceRoutes = require('./routes/services');
const campaignRoutes = require('./routes/campaigns');
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Halı Yıkama API is running' });
});

// For Vercel, we export the app. For local dev, we sync and listen.
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to sync db:', err);
  });
}

module.exports = app;
