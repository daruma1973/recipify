const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { loginValidation } = require('../middleware/validators');
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/auth - Getting user profile for ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }
    
    console.log('User profile retrieved successfully');
    res.json(user);
  } catch (err) {
    console.error('Error retrieving user profile:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', loginValidation, async (req, res) => {
  console.log('POST /api/auth - Login attempt:', req.body.email);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    console.log('User found:', user.email);
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

    console.log('Creating token for user ID:', user.id);
    
    const jwtSecret = process.env.JWT_SECRET || 'recipify_secret_key';
    console.log('Using JWT secret:', jwtSecret ? 'Secret is set' : 'No secret set');
    
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        console.log('Login successful, token created');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 