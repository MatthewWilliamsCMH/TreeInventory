const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://matthewwilliamscmh:ehesCWOxppqtvtUh@local.vbxwz.mongodb.net/treeinventorydb'); //use environment variable (production) or local (development)
    console.log('Connected to the tree inventory database.');
  } 
  catch (err) {
    console.error('Error connecting to the tree inventory database: ', err);
    process.exit(1);
  }
};

module.exports = { connectDB };
