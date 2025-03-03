const { check } = require('express-validator');

// User registration validation
const registerValidation = [
  check('name', 'Please add name').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 })
];

// Login validation
const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Profile update validation
const profileUpdateValidation = [
  check('name', 'Name is required').not().isEmpty()
];

// Password change validation
const passwordChangeValidation = [
  check('currentPassword', 'Current password is required').exists(),
  check(
    'newPassword',
    'Please enter a new password with 6 or more characters'
  ).isLength({ min: 6 })
];

module.exports = {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation
}; 