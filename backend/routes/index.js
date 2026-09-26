const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const authRoutes = require('./authRoutes');

const specialistRoutes = require('./specialistRoutes');
const serviceRoutes = require('./serviceRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const patientRoutes = require('./patientRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns API operational status, timestamp, environment mode, and database connection status.
 */
router.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const statusCode = isDbConnected ? 200 : 503;

  res.status(statusCode).json({
    success: isDbConnected,
    message: isDbConnected ? 'Zareen Skin Care API is running' : 'Database service is unavailable',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isDbConnected ? 'connected' : 'disconnected',
  });
});

// Authentication & Identity Routes
router.use('/auth', authRoutes);

// Specialist Directory & Profile Management Routes
router.use('/specialists', specialistRoutes);

// Clinical Services Management Routes
router.use('/services', serviceRoutes);

// Specialist Working Hours & Availability Routes
router.use('/availability', availabilityRoutes);

// Appointments Management Routes
router.use('/appointments', appointmentRoutes);

// Patient Profile Management Routes
router.use('/patients', patientRoutes);

// In-App Notifications Routes
router.use('/notifications', notificationRoutes);

// Administrator Management & Reports Routes
router.use('/admin', adminRoutes);

module.exports = router;

