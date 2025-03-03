const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'server/.env') });

// User model
const User = require('./server/models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipify');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    return false;
  }
};

// Check if test user exists
const checkTestUser = async () => {
  try {
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to database');
      return;
    }

    // Find user by email
    const user = await User.findOne({ email: 'test@example.com' });

    if (user) {
      console.log('Test user found in database:');
      console.log('ID:', user._id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Password (hashed):', user.password);
      console.log('Created:', user.date);
    } else {
      console.log('Test user not found in database');
    }

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error checking user:', err.message);
  }
};

// Run the script
checkTestUser(); 