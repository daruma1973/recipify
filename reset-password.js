const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Reset user password
const resetPassword = async (email, newPassword) => {
  try {
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to database');
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found in database`);
      await mongoose.disconnect();
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    console.log(`Password reset successful for user: ${email}`);
    console.log('New password (plaintext):', newPassword);
    console.log('New password (hashed):', hashedPassword);

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error resetting password:', err.message);
  }
};

// Run the script
const email = 'test@example.com';
const newPassword = 'password123';

console.log(`Resetting password for user: ${email}`);
console.log(`New password will be: ${newPassword}`);

resetPassword(email, newPassword); 