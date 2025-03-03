const axios = require('axios');

async function testClientProxy() {
  console.log('Testing client proxy configuration...');
  
  try {
    // First, get a token by direct API call
    console.log('Getting token from direct API call...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth', {
      email: 'test@example.com',
      password: 'newpassword123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const token = loginResponse.data.token;
    console.log('Token obtained:', token);
    
    // Now test the client proxy
    console.log('\nTesting client proxy with token...');
    try {
      const proxyResponse = await axios.get('/api/auth', {
        headers: {
          'x-auth-token': token
        },
        baseURL: 'http://localhost:3000'
      });
      
      console.log('Proxy test successful!');
      console.log('Response status:', proxyResponse.status);
      console.log('User data:', proxyResponse.data);
      
      return {
        success: true,
        directApi: true,
        clientProxy: true
      };
    } catch (proxyErr) {
      console.error('Client proxy test failed:');
      console.error(`Status: ${proxyErr.response?.status}`);
      console.error(`Message: ${proxyErr.response?.data?.msg || proxyErr.message}`);
      
      return {
        success: false,
        directApi: true,
        clientProxy: false,
        proxyError: proxyErr.response?.data?.msg || proxyErr.message
      };
    }
  } catch (err) {
    console.error('Direct API test failed:');
    console.error(`Status: ${err.response?.status}`);
    console.error(`Message: ${err.response?.data?.msg || err.message}`);
    
    return {
      success: false,
      directApi: false,
      clientProxy: false,
      directError: err.response?.data?.msg || err.message
    };
  }
}

// Run the test
testClientProxy().then(result => {
  console.log('\nTest summary:');
  console.log('Direct API working:', result.directApi ? 'YES' : 'NO');
  console.log('Client proxy working:', result.clientProxy ? 'YES' : 'NO');
  
  if (!result.directApi) {
    console.log('Direct API error:', result.directError);
  }
  
  if (!result.clientProxy && result.directApi) {
    console.log('Client proxy error:', result.proxyError);
    console.log('\nPossible issues:');
    console.log('1. The "proxy" field in client/package.json might not be set correctly');
    console.log('2. The React development server might not be running');
    console.log('3. The proxy middleware might not be configured correctly');
  }
}); 