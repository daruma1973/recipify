const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test user registration
const testRegister = async () => {
  try {
    const res = await axios.post(`${API_URL}/users`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', res.data);
    return res.data.token;
  } catch (err) {
    console.error('Registration error:', err.response ? err.response.data : err.message);
    return null;
  }
};

// Test user login
const testLogin = async () => {
  try {
    const res = await axios.post(`${API_URL}/auth`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', res.data);
    return res.data.token;
  } catch (err) {
    console.error('Login error:', err.response ? err.response.data : err.message);
    return null;
  }
};

// Test getting user profile
const testGetUser = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/auth`, {
      headers: {
        'x-auth-token': token
      }
    });
    console.log('User profile:', res.data);
  } catch (err) {
    console.error('Get user error:', err.response ? err.response.data : err.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('Testing API endpoints...');
  
  // Try to register a new user
  let token = await testRegister();
  
  // If registration fails (user might already exist), try login
  if (!token) {
    token = await testLogin();
  }
  
  // If we have a token, test getting user profile
  if (token) {
    await testGetUser(token);
  }
  
  console.log('Tests completed.');
};

runTests(); 