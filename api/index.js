const app = require('../server/index');
const { sequelize } = require('../server/models');

// In a serverless environment, we need to ensure the DB is synced.
// Note: This can add latency to the first request, but it's necessary for SQLite.
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced in serverless function');
  } catch (err) {
    console.error('Database sync error in serverless:', err);
  }
};

// Vercel serverless functions don't stay alive.
// We sync on each container cold start.
let isSynced = false;

module.exports = async (req, res) => {
  if (!isSynced) {
    await syncDB();
    isSynced = true;
  }
  return app(req, res);
};
