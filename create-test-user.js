
  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  const User = require('./server/models/User');
  const config = require('./server/config/db');

  // Connect to MongoDB
  mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB Connected...');
    
    try {
      // Check if test user exists
      let user = await User.findOne({ email: 'test@example.com' });
      
      if (user) {
        console.log('Test user already exists');
      } else {
        // Create test user
        user = new User({
          name: 'Test User',
          email: 'test@example.com',
          password: 'newpassword123'
        });
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();
        console.log('Test user created');
      }
      
      process.exit(0);
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
  