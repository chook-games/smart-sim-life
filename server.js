const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Optimized health check endpoint - must be first for deployment
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Fast root endpoint for health checks - serve minimal response first
app.get('/', (req, res) => {
  // Quick response for health checks
  res.setHeader('Cache-Control', 'no-cache');
  // Try public directory first, fallback to root
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  const rootIndex = path.join(__dirname, 'index.html');
  
  // Check if public/index.html exists, otherwise use root index.html
  require('fs').access(publicIndex, require('fs').constants.F_OK, (err) => {
    if (err) {
      res.sendFile(rootIndex);
    } else {
      res.sendFile(publicIndex);
    }
  });
});

// Static file serving with no-cache for development
app.use(express.static('public', { 
  maxAge: 0,
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Fallback to serve from root for backward compatibility
app.use(express.static('.', { 
  maxAge: 0,
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// API endpoint for future enhancements (optional)
app.get('/api/status', (req, res) => {
  res.json({ 
    game: 'SmartSim Life',
    version: '1.0.0',
    status: 'running'
  });
});

// Handle static files and fallback to main game
app.use(express.static('.', { fallthrough: true }));

// Fallback for SPA routes
app.use((req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  const rootIndex = path.join(__dirname, 'index.html');
  
  require('fs').access(publicIndex, require('fs').constants.F_OK, (err) => {
    if (err) {
      res.sendFile(rootIndex);
    } else {
      res.sendFile(publicIndex);
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server with proper error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`SmartSim Life Game server running on port ${PORT}`);
  console.log(`Health check available at: http://0.0.0.0:${PORT}/health`);
  console.log(`Game available at: http://0.0.0.0:${PORT}/`);
});

// Handle server startup errors
server.on('error', (err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;