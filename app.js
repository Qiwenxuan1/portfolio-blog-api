const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '32kb' }));
app.get('/', function (req, res) {
  res.json({ message: 'Portfolio and Blog API' });
});
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/blog', require('./routes/postRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(require('./middleware/notFound'));
app.use(require('./middleware/errorHandler'));

module.exports = app;
