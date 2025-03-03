const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5002/api';

// Test login with specific credentials
const testLogin = async (email, password) => {
  try {
    console.log(`Testing login with email: ${email} and password: ${password}`);
    
    console.log('Request URL:', `${API_URL}/auth`);
    console.log('Request body:', JSON.stringify({ email, password }));
    
    const res = await axios.post(`${API_URL}/auth`, {
      email,
      password
    });
    
    console.log('Login successful!');
    console.log('Response status:', res.status);
    console.log('Response data:', JSON.stringify(res.data));
    return res.data.token;
  } catch (err) {
    console.error('Login error:', err.response ? JSON.stringify(err.response.data) : err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Headers:', JSON.stringify(err.response.headers));
    }
    return null;
  }
};

// Test get user profile
const testGetProfile = async (token) => {
  try {
    console.log('Testing get user profile...');
    console.log('Using token:', token);
    
    const res = await axios.get(`${API_URL}/auth`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('User profile retrieved:');
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err) {
    console.error('Get profile error:', err.response ? JSON.stringify(err.response.data) : err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
    }
    return null;
  }
};

// Run the tests
const runTests = async () => {
  // Test server connection
  try {
    console.log('Testing server connection...');
    const res = await axios.get(`${API_URL}/test`);
    console.log('Server is running:', res.data);
  } catch (err) {
    console.error('Server connection error:', err.message);
    return;
  }
  
  // Test login with admin credentials
  console.log('\nAttempting login with admin credentials...');
  const adminToken = await testLogin('admin@recipify.com', 'admin123');
  
  if (adminToken) {
    console.log('\nAdmin login successful!');
    
    // Test get profile with admin token
    console.log('\nTesting get profile with admin token...');
    await testGetProfile(adminToken);
  } else {
    console.log('\nAdmin login failed.');
  }
  
  // Test login with test user credentials
  console.log('\nAttempting login with test user credentials...');
  const userToken = await testLogin('test@example.com', 'password123');
  
  if (userToken) {
    console.log('\nTest user login successful!');
    
    // Test get profile with test user token
    console.log('\nTesting get profile with test user token...');
    await testGetProfile(userToken);
  } else {
    console.log('\nTest user login failed.');
  }
};

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err.message);
}); 