const mongoose = require('mongoose');
module.exports = async function (req, res) {
  res.set('Cache-Control', 'no-store');
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is not connected');
    }
    await mongoose.connection.db.command({ ping: 1 });
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(503).json({ status: 'unavailable' });
  }
};