const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { 
  registerValidation, 
  profileUpdateValidation, 
  passwordChangeValidation 
} = require('../middleware/validators');
const User = require('../models/User');

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', [auth, checkRole('admin')], async (req, res) => {
  console.log('GET /api/users - Admin request to get all users');
  
  try {
    const users = await User.find().select('-password');
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('Error getting users:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', registerValidation, async (req, res) => {
  console.log('POST /api/users - Registration attempt');
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log('New user registered:', email);

    const payload = {
      user: {
        id: user.id
      }
    };

    const jwtSecret = process.env.JWT_SECRET || 'recipify_secret_key';
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        console.log('Registration successful, token created');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [auth, profileUpdateValidation], async (req, res) => {
  console.log('PUT /api/users/profile - Update profile request');
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found for profile update, ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    console.log('Profile updated successfully for user:', user.email);
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', [auth, passwordChangeValidation], async (req, res) => {
  console.log('PUT /api/users/password - Password change request');
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found for password change, ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log('Current password match result:', isMatch);

    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    console.log('Password updated successfully for user:', user.email);

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 