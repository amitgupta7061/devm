const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');

// In-memory chaos test state for DevOps demonstration
let simulatedState = {
  dbOverride: null, // null | 'DISCONNECTED'
  latencyMs: 0
};

// @route   GET /api/health
// @desc    Application health check for Nagios, Jenkins & Docker
// @access  Public
router.get('/', async (req, res) => {
  if (simulatedState.latencyMs > 0) {
    await new Promise(r => setTimeout(r, simulatedState.latencyMs));
  }

  const realDbConnected = mongoose.connection.readyState === 1;
  const isDbConnected = simulatedState.dbOverride !== null 
    ? (simulatedState.dbOverride !== 'DISCONNECTED') 
    : realDbConnected;

  const healthData = {
    status: isDbConnected ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    service: 'Smart Campus Service Management System',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    devops: {
      provisioning: 'Terraform AWS IaC',
      configuration: 'Puppet Enterprise Manifests',
      containerization: 'Docker Compose Bridge Network',
      cicd: 'Jenkins Declarative Pipeline',
      monitoring: 'Nagios Core Active Polling'
    },
    database: {
      status: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
      stateCode: isDbConnected ? 1 : 0,
      host: mongoose.connection.host || 'mongo-container'
    },
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      hostname: os.hostname(),
      loadAverage: os.loadavg ? os.loadavg() : [0.15, 0.12, 0.08],
      memory: {
        totalBytes: os.totalmem(),
        freeBytes: os.freemem(),
        usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
      }
    }
  };

  const statusCode = isDbConnected ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// @route   POST /api/health/chaos
// @desc    Endpoint to simulate failure states for Nagios alert demonstration
// @access  Public
router.post('/chaos', (req, res) => {
  const { action } = req.body;
  if (action === 'simulate_db_down') {
    simulatedState.dbOverride = 'DISCONNECTED';
  } else if (action === 'restore_db') {
    simulatedState.dbOverride = null;
    simulatedState.latencyMs = 0;
  } else if (action === 'simulate_latency') {
    simulatedState.latencyMs = 2000;
  }
  res.json({
    success: true,
    message: `Chaos engineering state updated: ${action}`,
    simulatedState
  });
});

// @route   GET /api/health/metrics
// @desc    Metrics endpoint in plain key-value format for Nagios plugins
// @access  Public
router.get('/metrics', (req, res) => {
  const isDbConnected = (simulatedState.dbOverride !== 'DISCONNECTED' && mongoose.connection.readyState === 1) ? 1 : 0;
  const memoryUsage = process.memoryUsage();
  
  res.setHeader('Content-Type', 'text/plain');
  res.send([
    `# HELP smart_campus_up Service availability`,
    `# TYPE smart_campus_up gauge`,
    `smart_campus_up 1`,
    `smart_campus_database_connected ${isDbConnected}`,
    `smart_campus_uptime_seconds ${Math.floor(process.uptime())}`,
    `smart_campus_heap_used_bytes ${memoryUsage.heapUsed}`,
    `smart_campus_heap_total_bytes ${memoryUsage.heapTotal}`,
    `smart_campus_rss_bytes ${memoryUsage.rss}`
  ].join('\n'));
});

module.exports = router;
