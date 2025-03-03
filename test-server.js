const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'server/.env') });

// User model
const User = require('./server/models/User');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipify');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

// Auth middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'recipify_secret_key');

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes

// @route   GET /api/test
// @desc    Test route
// @access  Public
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Test server is running' });
});

// @route   POST /api/auth
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/auth', async (req, res) => {
  console.log('Login attempt:', req.body);
  
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    console.log('Stored password hash:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'recipify_secret_key',
      { expiresIn: 360000 }
    );

    console.log('Login successful, token created');
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth
// @desc    Get logged in user
// @access  Private
app.get('/api/auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
app.put('/api/users/profile', auth, async (req, res) => {
  console.log('Update profile request:', req.body);
  const { name } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found for profile update');
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    console.log('Profile updated successfully:', user);
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
app.put('/api/users/password', auth, async (req, res) => {
  console.log('Password change request received');
  
  const { currentPassword, newPassword } = req.body;
  
  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      msg: 'Please provide both current password and new password' 
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ 
      msg: 'New password must be at least 6 characters long' 
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found for password change');
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    
    console.log('Password updated successfully');
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Start server
const PORT = 5002;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Test server started on port ${PORT}`));
}); 