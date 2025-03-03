const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5001/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@recipify.com',
  password: 'admin123'
};

// Store tokens for authenticated requests
let testUserToken = null;
let adminToken = null;

// Test server connection
const testServerConnection = async () => {
  try {
    console.log('Testing server connection...');
    // Try to access a public endpoint
    const res = await axios.get(`${API_URL}/test`);
    console.log('Server is running:', res.data);
    return true;
  } catch (err) {
    if (err.response) {
      // If we get a response, the server is running even if it returned an error
      console.log('Server is running but returned:', err.response.status, err.response.data);
      return true;
    } else {
      console.error('Server connection error:', err.message);
      return false;
    }
  }
};

// Test login
const testLogin = async (user) => {
  try {
    console.log(`Testing login for ${user.email}...`);
    
    const res = await axios.post(`${API_URL}/auth`, {
      email: user.email,
      password: user.password
    });
    
    console.log('Login successful!');
    console.log('Token received');
    return res.data.token;
  } catch (err) {
    console.error('Login error:', err.response ? err.response.data : err.message);
    return null;
  }
};

// Test get user profile
const testGetProfile = async (token) => {
  try {
    console.log('Testing get user profile...');
    
    const res = await axios.get(`${API_URL}/auth`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('User profile retrieved:', res.data);
    return res.data;
  } catch (err) {
    console.error('Get profile error:', err.response ? err.response.data : err.message);
    return null;
  }
};

// Test update profile
const testUpdateProfile = async (token, name) => {
  try {
    console.log('Testing update profile...');
    
    const res = await axios.put(
      `${API_URL}/users/profile`, 
      { name },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        } 
      }
    );
    
    console.log('Profile updated:', res.data);
    return res.data;
  } catch (err) {
    console.error('Update profile error:', err.response ? err.response.data : err.message);
    return null;
  }
};

// Test change password
const testChangePassword = async (token, currentPassword, newPassword) => {
  try {
    console.log('Testing change password...');
    
    const res = await axios.put(
      `${API_URL}/users/password`, 
      {
        currentPassword,
        newPassword
      },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        } 
      }
    );
    
    console.log('Password changed:', res.data);
    return true;
  } catch (err) {
    console.error('Change password error:', err.response ? err.response.data : err.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('Starting authentication system verification...');
  
  // Check server connection
  const serverRunning = await testServerConnection();
  if (!serverRunning) {
    console.log('Server is not running, aborting tests');
    return;
  }
  
  // Test user login
  console.log('\n--- Test User Authentication ---');
  testUserToken = await testLogin(testUser);
  if (!testUserToken) {
    console.log('Test user login failed, skipping related tests');
  } else {
    // Get test user profile
    const testUserProfile = await testGetProfile(testUserToken);
    
    // Update test user profile
    if (testUserProfile) {
      const updatedProfile = await testUpdateProfile(testUserToken, 'Updated Test User');
      console.log('Profile update test:', updatedProfile ? 'PASSED' : 'FAILED');
    }
    
    // Change test user password
    const passwordChanged = await testChangePassword(
      testUserToken, 
      testUser.password, 
      'newpassword123'
    );
    console.log('Password change test:', passwordChanged ? 'PASSED' : 'FAILED');
    
    // If password was changed, test login with new password
    if (passwordChanged) {
      console.log('Testing login with new password...');
      const newPasswordToken = await testLogin({
        ...testUser,
        password: 'newpassword123'
      });
      
      console.log('Login with new password:', newPasswordToken ? 'PASSED' : 'FAILED');
      
      // Change back to original password
      if (newPasswordToken) {
        const passwordResetResult = await testChangePassword(
          newPasswordToken,
          'newpassword123',
          testUser.password
        );
        console.log('Password reset to original:', passwordResetResult ? 'PASSED' : 'FAILED');
      }
    }
  }
  
  // Admin user login
  console.log('\n--- Admin User Authentication ---');
  adminToken = await testLogin(adminUser);
  if (!adminToken) {
    console.log('Admin login failed, skipping related tests');
  } else {
    // Get admin profile
    const adminProfile = await testGetProfile(adminToken);
    
    // Update admin profile
    if (adminProfile) {
      const updatedProfile = await testUpdateProfile(adminToken, 'Updated Admin User');
      console.log('Admin profile update test:', updatedProfile ? 'PASSED' : 'FAILED');
    }
  }
  
  console.log('\nAuthentication system verification completed');
};

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err.message);
}); 