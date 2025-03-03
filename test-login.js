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

// Run the login test with admin credentials
console.log('Attempting login with admin credentials...');
testLogin('admin@recipify.com', 'admin123')
  .then(token => {
    if (token) {
      console.log('Admin login successful!');
    } else {
      console.log('Admin login failed.');
    }
  })
  .catch(err => {
    console.error('Unhandled error:', err.message);
  }); 