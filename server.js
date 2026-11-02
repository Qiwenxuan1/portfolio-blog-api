require('dotenv').config();
const db = require('./config/db');
const app = require('./app');
const port = process.env.PORT || 3000;

async function start() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('Set a long random JWT_SECRET in .env.');
    }
    await db.connectDB();
    app.listen(port, function () {
      console.log('API ready on port ' + port);
    });
  } catch (error) {
    console.error('Startup failed. Check private settings and Atlas access.');
    process.exit(1);
  }
}

start();
