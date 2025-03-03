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

// Create admin user
const createAdminUser = async () => {
  try {
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to database');
      return;
    }

    // Admin user data
    const adminData = {
      name: 'Admin User',
      email: 'admin@recipify.com',
      password: 'admin123',
      role: 'admin'
    };

    // Check if admin already exists
    let admin = await User.findOne({ email: adminData.email });

    if (admin) {
      console.log('Admin user already exists, updating password...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Update password
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('Admin password updated successfully');
    } else {
      console.log('Creating new admin user...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      // Create new admin
      admin = new User({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role
      });
      
      await admin.save();
      
      console.log('Admin user created successfully');
    }

    console.log('Admin user details:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
};

// Run the script
createAdminUser(); 