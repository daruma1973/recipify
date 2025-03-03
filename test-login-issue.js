const axios = require('axios');

// Test login functionality
async function testLogin() {
  console.log('Testing login functionality...');
  
  try {
    // Test login with test user
    console.log('Attempting to login with test user...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth', {
      email: 'test@example.com',
      password: 'newpassword123'
    });
    
    console.log('Login successful!');
    console.log('Token:', loginResponse.data.token);
    
    // Test getting user profile with token
    console.log('\nTesting profile retrieval with token...');
    const token = loginResponse.data.token;
    
    const profileResponse = await axios.get('http://localhost:5000/api/auth', {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('Profile retrieved successfully:');
    console.log(profileResponse.data);
    
    // Test client-side proxy
    console.log('\nTesting client-side proxy...');
    try {
      const proxyResponse = await axios.get('/api/auth', {
        headers: {
          'x-auth-token': token
        },
        baseURL: 'http://localhost:3000'
      });
      console.log('Proxy test successful!');
      console.log(proxyResponse.data);
    } catch (err) {
      console.error('Proxy test failed:');
      console.error(`Status: ${err.response?.status}`);
      console.error(`Message: ${err.response?.data?.msg || err.message}`);
      console.error('This suggests the client proxy is not working correctly.');
    }
    
  } catch (err) {
    console.error('Login test failed:');
    console.error(`Status: ${err.response?.status}`);
    console.error(`Message: ${err.response?.data?.msg || err.message}`);
    
    if (err.code === 'ECONNREFUSED') {
      console.error('Could not connect to the server. Make sure the server is running on port 5000.');
    }
  }
}

testLogin(); 