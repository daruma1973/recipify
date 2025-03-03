import axios from 'axios';

const setAuthToken = token => {
  console.log('setAuthToken: BYPASSED (Development Mode)');
  
  // Always set a dummy token in axios headers
  axios.defaults.headers.common['x-auth-token'] = 'dummy-token-for-development';
  
  // Store the dummy token in localStorage for consistency
  localStorage.setItem('token', 'dummy-token-for-development');
  
  console.log('setAuthToken: Dummy token set for development');
  
  // Original code is commented out below for reference
  /*
  if (token) {
    console.log('setAuthToken: Setting token in axios headers');
    axios.defaults.headers.common['x-auth-token'] = token;
    
    // Verify token was set
    const currentToken = axios.defaults.headers.common['x-auth-token'];
    console.log('setAuthToken: Verification - token in headers:', currentToken ? 'Token is set' : 'Token is NOT set');
    
    // Also store in localStorage
    localStorage.setItem('token', token);
    console.log('setAuthToken: Token also stored in localStorage');
  } else {
    console.log('setAuthToken: Removing token from axios headers');
    delete axios.defaults.headers.common['x-auth-token'];
    
    // Verify token was removed
    const currentToken = axios.defaults.headers.common['x-auth-token'];
    console.log('setAuthToken: Verification - token in headers:', currentToken ? 'Token is still set (error)' : 'Token was removed');
    
    // Also remove from localStorage
    localStorage.removeItem('token');
    console.log('setAuthToken: Token also removed from localStorage');
  }
  */
};

export default setAuthToken;