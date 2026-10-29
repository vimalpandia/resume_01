const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // Fallback to root .env if running from root

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Attempt database connection
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 AI Resume Analyzer Pro Server Running on Port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🛡️  Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('\n[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('[Server Fatal] Startup error:', err);
    process.exit(1);
  }
}

startServer();
