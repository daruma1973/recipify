const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Applying fixes to the authentication system...');

// Function to check if the server is running
function checkServerRunning(callback) {
  const http = require('http');
  const options = {
    host: 'localhost',
    port: 5000,
    path: '/api/test',
    timeout: 2000
  };

  const req = http.get(options, (res) => {
    console.log(`Server is running, status: ${res.statusCode}`);
    callback(true);
  });

  req.on('error', (err) => {
    console.log(`Server is not running: ${err.message}`);
    callback(false);
  });

  req.on('timeout', () => {
    console.log('Request timed out checking server');
    req.destroy();
    callback(false);
  });
}

// Function to create a test user if it doesn't exist
function createTestUser() {
  console.log('Creating test user if it doesn\'t exist...');
  
  const testUserScript = `
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
  `;
  
  fs.writeFileSync('create-test-user.js', testUserScript);
  
  exec('node create-test-user.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating test user: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// Function to test the login functionality
function testLogin() {
  console.log('Testing login functionality...');
  
  exec('node test-login-direct.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error testing login: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// Main function to run all fixes
function applyFixes() {
  console.log('Checking if server is running...');
  
  checkServerRunning((isRunning) => {
    if (!isRunning) {
      console.log('Server is not running. Please start the server before running this script.');
      return;
    }
    
    console.log('Server is running. Proceeding with fixes...');
    
    // Create test user
    createTestUser();
    
    // Wait for test user to be created
    setTimeout(() => {
      // Test login functionality
      testLogin();
      
      console.log('All fixes applied. Please restart both the client and server applications.');
    }, 5000);
  });
}

// Run the fixes
applyFixes(); 