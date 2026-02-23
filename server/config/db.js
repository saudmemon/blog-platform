const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blog-platform');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.error('Please make sure your MongoDB service is running.');
    console.error('If you are using a local MongoDB, try: net start MongoDB');
    // Don't exit immediately in dev mode, let the server start so we can see error pages
    // process.exit(1); 
  }
};

module.exports = connectDB;

