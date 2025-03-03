const User = require('../models/User');

/**
 * Middleware to check if the user has the required role
 * @param {string|string[]} roles - Required role(s) to access the route
 * @returns {function} Express middleware function
 */
module.exports = (roles) => {
  // Convert single role to array
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return async (req, res, next) => {
    console.log('Role check - BYPASSED (Development Mode)');
    console.log(`Role check would have required: ${roles.join(', ')}`);
    
    // Always proceed to the next middleware/route handler
    next();
    
    // Original code is commented out below for reference
    /*
    try {
      // Get user from database
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        console.log('Role check: User not found');
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Check if user has required role
      if (!roles.includes(user.role)) {
        console.log(`Role check: User role ${user.role} does not have permission. Required: ${roles.join(', ')}`);
        return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
      }
      
      // User has required role, proceed
      console.log(`Role check: User has required role ${user.role}`);
      next();
    } catch (err) {
      console.error('Role check error:', err.message);
      res.status(500).send('Server Error');
    }
    */
  };
}; 