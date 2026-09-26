const mongoose = require('mongoose');

/**
 * Connect to MongoDB database instance
 * Loads MONGODB_URI from environment variables.
 * Logs connection metadata upon success or raises a fatal error on failure.
 */
const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zareen_skin_care';
    
    const conn = await mongoose.connect(connUri);

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    // Allow caller or server startup to handle error or gracefully exit
    throw error;
  }
};

module.exports = connectDB;
