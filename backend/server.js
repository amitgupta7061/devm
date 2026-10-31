const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger for debugging and DevOps log analytics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Mount Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/users', require('./routes/users'));

// Base route for quick test
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Campus Service Management System API',
    architecture: 'Enterprise DevOps Lifecycle & Monitoring',
    status: 'Active',
    healthEndpoint: '/api/health'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Automatic Seeder Helper for fresh databases
const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Empty database detected. Populating demo data...');
      const seedData = require('./seed');
      // seedData executes or can be called directly
    }
  } catch (err) {
    console.log('[AutoSeed] Database check skipped or pending connection.');
  }
};

// Start Server after connecting to DB
const startServer = async () => {
  await connectDB();
  await autoSeedIfEmpty();

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Smart Campus Backend API is running on port: ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Course: INT333 - DevOps Advanced Configuration Mgmt`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown for Docker and Nagios process management
  const shutdown = () => {
    console.log('Received kill signal, shutting down gracefully...');
    server.close(() => {
      console.log('Closed remaining connections. Process exited.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

if (require.main === module) {
  startServer();
}

module.exports = app;

