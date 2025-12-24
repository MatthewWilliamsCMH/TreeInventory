// server/config/connection.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbName =
      process.env.NODE_ENV === 'production'
        ? process.env.MONGODB_DB_PROD || 'treeinventory_prod'
        : process.env.MONGODB_DB_DEV || 'treeinventory_dev';

    const baseUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    const mongoUri = baseUri.replace(/\/[^/]+$/, `/${dbName}`);

    console.log('Connecting to MongoDB with URI:', mongoUri);
    const conn = await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', conn.connection.host, 'Database:', conn.connection.name);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = { connectDB };
