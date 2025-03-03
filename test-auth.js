const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5002/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Store token for authenticated requests
let token = null;

// Helper function for authenticated requests
const authRequest = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token for requests
const setAuthToken = (token) => {
  if (token) {
    authRequest.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete authRequest.defaults.headers.common['x-auth-token'];
  }
};

// Test login
const testLogin = async () => {
  try {
    console.log('Testing login...');
    console.log('Login data:', testUser.email, 'password:', testUser.password);
    
    const res = await axios.post(`${API_URL}/auth`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('Login response:', res.data);
    token = res.data.token;
    setAuthToken(token);
    console.log('Login successful, token received');
    return true;
  } catch (err) {
    console.error('Login error:', err.response ? err.response.data : err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
    }
    return false;
  }
};

// Test get user profile
const testGetProfile = async () => {
  try {
    console.log('Testing get user profile...');
    console.log('Using token:', token);
    
    const res = await axios.get(`${API_URL}/auth`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('User profile retrieved:', res.data);
    return res.data;
  } catch (err) {
    console.error('Get profile error:', err.response ? err.response.data : err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
    }
    return null;
  }
};

// Test update profile
const testUpdateProfile = async () => {
  try {
    console.log('Testing update profile...');
    console.log('Using token:', token);
    const updatedName = 'Updated Test User';
    
    const res = await axios.put(
      `${API_URL}/users/profile`, 
      { name: updatedName },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        } 
      }
    );
    
    console.log('Profile updated:', res.data);
    return res.data.name === updatedName;
  } catch (err) {
    console.error('Update profile error:', err.response ? err.response.data : err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
    }
    return false;
  }
};

// Test change password
const testChangePassword = async () => {
  try {
    console.log('Testing change password...');
    console.log('Using token:', token);
    
    const res = await axios.put(
      `${API_URL}/users/password`, 
      {
        currentPassword: testUser.password,
        newPassword: 'newpassword123'
      },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        } 
      }
    );
    
    console.log('Password changed:', res.data);
    
    // Test login with new password
    console.log('Testing login with new password...');
    const loginRes = await axios.post(`${API_URL}/auth`, {
      email: testUser.email,
      password: 'newpassword123'
    });
    
    token = loginRes.data.token;
    setAuthToken(token);
    
    // Change back to original password for future tests
    await axios.put(
      `${API_URL}/users/password`, 
      {
        currentPassword: 'newpassword123',
        newPassword: testUser.password
      },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        } 
      }
    );
    
    return true;
  } catch (err) {
    console.error('Change password error:', err.response ? err.response.data : err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
    }
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('Starting authentication tests...');
  
  // Try to login
  const loggedIn = await testLogin();
  if (!loggedIn) {
    console.log('Failed to authenticate, aborting tests');
    return;
  }
  
  // Get user profile
  const profile = await testGetProfile();
  if (!profile) {
    console.log('Failed to get profile, aborting tests');
    return;
  }
  
  // Update profile
  const profileUpdated = await testUpdateProfile();
  console.log('Profile update test:', profileUpdated ? 'PASSED' : 'FAILED');
  
  // Change password
  const passwordChanged = await testChangePassword();
  console.log('Password change test:', passwordChanged ? 'PASSED' : 'FAILED');
  
  console.log('Authentication tests completed');
};

// Run the tests
runTests(); 