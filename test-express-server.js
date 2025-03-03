const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Simple auth middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'test_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Create a hashed password for 'password123'
const hashedPassword = bcrypt.hashSync('password123', 10);
console.log('Hashed password for testing:', hashedPassword);

// Mock user data
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    role: 'user',
    date: new Date()
  }
];

// Routes

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
app.get('/api/auth', auth, (req, res) => {
  console.log('GET /api/auth - User ID:', req.user.id);
  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
app.post('/api/auth', (req, res) => {
  console.log('POST /api/auth - Login attempt:', req.body);
  const { email, password } = req.body;

  // Check if user exists
  const user = users.find(user => user.email === email);
  if (!user) {
    console.log('User not found:', email);
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // Check password
  const isMatch = bcrypt.compareSync(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // Create JWT
  const payload = {
    user: {
      id: user.id
    }
  };

  const token = jwt.sign(payload, 'test_secret', { expiresIn: 360000 });
  console.log('Login successful, token generated');
  res.json({ token });
});

// @route   POST api/users
// @desc    Register a user
// @access  Public
app.post('/api/users', (req, res) => {
  console.log('POST /api/users - Registration attempt:', req.body);
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'user',
    date: new Date()
  };

  users.push(newUser);
  console.log('New user registered:', newUser.email);

  // Create JWT
  const payload = {
    user: {
      id: newUser.id
    }
  };

  const token = jwt.sign(payload, 'test_secret', { expiresIn: 360000 });
  res.json({ token });
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
app.put('/api/users/profile', auth, (req, res) => {
  console.log('PUT /api/users/profile - Update attempt:', req.body);
  const { name } = req.body;

  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // Update user
  user.name = name || user.name;
  console.log('Profile updated for user:', user.email);

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// @route   PUT api/users/password
// @desc    Change user password
// @access  Private
app.put('/api/users/password', auth, (req, res) => {
  console.log('PUT /api/users/password - Password change attempt');
  const { currentPassword, newPassword } = req.body;

  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // Check current password
  const isMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Current password is incorrect' });
  }

  // Update password
  user.password = bcrypt.hashSync(newPassword, 10);
  console.log('Password updated for user:', user.email);

  res.json({ msg: 'Password updated successfully' });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Test server started on port ${PORT}`)); 