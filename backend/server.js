const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./database/connectDB');
const apiRoutes = require('./routes/index');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security & Parsing Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. API Routes
app.use('/api', apiRoutes);

// 3. Fallback 404 & Centralized Error Middleware
app.use(notFound);
app.use(errorHandler);

// 4. Server Initialization Function
const startServer = async () => {
  try {
    // Attempt MongoDB Connection
    const mongoose = require('mongoose');
    await connectDB();

    // Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`[Zareen Skin Care Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[Zareen Skin Care Backend] Health endpoint: http://localhost:${PORT}/api/health`);
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal) => {
      console.log(`\n[Zareen Skin Care Backend] Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('[Zareen Skin Care Backend] HTTP server closed.');
        try {
          await mongoose.connection.close(false);
          console.log('[Zareen Skin Care Backend] MongoDB connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Zareen Skin Care Backend] Error closing database connection:', err);
          process.exit(1);
        }
      });

      // Force shutdown if taking too long
      setTimeout(() => {
        console.error('[Zareen Skin Care Backend] Forcefully terminating after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error(`[Zareen Skin Care Backend] Startup Failed: ${error.message}`);
    process.exit(1);
  }
};

// Start automatically when run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
