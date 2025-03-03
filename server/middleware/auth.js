const mongoose = require('mongoose');

// No authentication middleware - completely removed
module.exports = function(req, res, next) {
  console.log('Auth middleware - COMPLETELY REMOVED');
  
  // Set a mock user for all requests with a valid ObjectId
  req.user = {
    id: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId format
    role: 'admin' // Give admin privileges to access all features
  };
  
  // Always proceed to the next middleware/route handler
  next();
}; 