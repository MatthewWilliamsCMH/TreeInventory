const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/treeInventoryDB'); //use environment variable (production) or local (development)
    console.log('Connected to the tree inventory database.');
  } 
  catch (err) {
    console.error('Error connecting to the tree inventory database: ', err);
    process.exit(1);
  }
};

module.exports = { connectDB };
