const fs = require('fs');
const path = require('path');

// Function to check and fix the client-side proxy configuration
function checkAndFixProxy() {
  console.log('Checking client-side proxy configuration...');
  
  const clientPackageJsonPath = path.join(__dirname, 'client', 'package.json');
  
  try {
    // Read the client package.json file
    const packageJson = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf8'));
    
    // Check if the proxy is correctly set
    if (packageJson.proxy !== 'http://localhost:5000') {
      console.log('Fixing proxy configuration...');
      packageJson.proxy = 'http://localhost:5000';
      
      // Write the updated package.json file
      fs.writeFileSync(clientPackageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Proxy configuration fixed!');
    } else {
      console.log('Proxy configuration is correct.');
    }
  } catch (err) {
    console.error('Error checking/fixing proxy configuration:', err.message);
  }
}

// Function to check and fix the auth token setup
function checkAndFixAuthToken() {
  console.log('\nChecking auth token setup...');
  
  const setAuthTokenPath = path.join(__dirname, 'client', 'src', 'utils', 'setAuthToken.js');
  
  try {
    // Read the setAuthToken.js file
    const setAuthTokenContent = fs.readFileSync(setAuthTokenPath, 'utf8');
    
    // Check if the file contains the correct implementation
    const correctImplementation = `import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;`;
    
    if (setAuthTokenContent.trim() !== correctImplementation.trim()) {
      console.log('Fixing auth token setup...');
      fs.writeFileSync(setAuthTokenPath, correctImplementation);
      console.log('Auth token setup fixed!');
    } else {
      console.log('Auth token setup is correct.');
    }
  } catch (err) {
    console.error('Error checking/fixing auth token setup:', err.message);
  }
}

// Function to check and fix the App.js token loading
function checkAndFixAppTokenLoading() {
  console.log('\nChecking App.js token loading...');
  
  const appJsPath = path.join(__dirname, 'client', 'src', 'App.js');
  
  try {
    // Read the App.js file
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    
    // Check if the file contains the token loading code
    if (!appJsContent.includes('if (localStorage.token)') || 
        !appJsContent.includes('setAuthToken(localStorage.token)')) {
      console.log('App.js is missing token loading code or it\'s incorrect.');
      console.log('Please make sure App.js contains the following code:');
      console.log('if (localStorage.token) {');
      console.log('  setAuthToken(localStorage.token);');
      console.log('}');
    } else {
      console.log('App.js token loading is correct.');
    }
  } catch (err) {
    console.error('Error checking App.js token loading:', err.message);
  }
}

// Function to check and fix the AuthState.js login function
function checkAndFixAuthStateLogin() {
  console.log('\nChecking AuthState.js login function...');
  
  const authStatePath = path.join(__dirname, 'client', 'src', 'context', 'auth', 'AuthState.js');
  
  try {
    // Read the AuthState.js file
    const authStateContent = fs.readFileSync(authStatePath, 'utf8');
    
    // Check if the login function is correctly implemented
    if (!authStateContent.includes('loadUser()')) {
      console.log('AuthState.js login function is missing loadUser() call.');
      console.log('Please make sure the login function in AuthState.js calls loadUser() after successful login.');
    } else {
      console.log('AuthState.js login function is correct.');
    }
  } catch (err) {
    console.error('Error checking AuthState.js login function:', err.message);
  }
}

// Function to check and fix the PrivateRoute component
function checkAndFixPrivateRoute() {
  console.log('\nChecking PrivateRoute component...');
  
  const privateRoutePath = path.join(__dirname, 'client', 'src', 'components', 'routing', 'PrivateRoute.js');
  
  try {
    // Read the PrivateRoute.js file
    const privateRouteContent = fs.readFileSync(privateRoutePath, 'utf8');
    
    // Check if the PrivateRoute component is correctly implemented
    if (!privateRouteContent.includes('return isAuthenticated ? children : <Navigate to="/login" />')) {
      console.log('PrivateRoute component may not be correctly implemented.');
      console.log('Please make sure it returns children when authenticated and redirects to login when not.');
    } else {
      console.log('PrivateRoute component is correct.');
    }
  } catch (err) {
    console.error('Error checking PrivateRoute component:', err.message);
  }
}

// Function to add debugging to the auth middleware
function addDebuggingToAuthMiddleware() {
  console.log('\nAdding debugging to auth middleware...');
  
  const authMiddlewarePath = path.join(__dirname, 'server', 'middleware', 'auth.js');
  
  try {
    // Read the auth.js file
    const authMiddlewareContent = fs.readFileSync(authMiddlewarePath, 'utf8');
    
    // Check if debugging is already added
    if (!authMiddlewareContent.includes('console.log(\'Auth middleware - token:\', token)')) {
      console.log('Adding debugging to auth middleware...');
      
      // Add debugging code
      const updatedContent = authMiddlewareContent.replace(
        'module.exports = function(req, res, next) {',
        'module.exports = function(req, res, next) {\n  console.log(\'Auth middleware - checking token\');\n'
      ).replace(
        'const token = req.header(\'x-auth-token\');',
        'const token = req.header(\'x-auth-token\');\n  console.log(\'Auth middleware - token:\', token);'
      ).replace(
        'try {',
        'try {\n    console.log(\'Auth middleware - verifying token\');'
      ).replace(
        'req.user = decoded.user;',
        'req.user = decoded.user;\n    console.log(\'Auth middleware - token verified, user:\', req.user);'
      ).replace(
        'catch (err) {',
        'catch (err) {\n    console.error(\'Auth middleware - token verification failed:\', err.message);'
      );
      
      fs.writeFileSync(authMiddlewarePath, updatedContent);
      console.log('Debugging added to auth middleware!');
    } else {
      console.log('Debugging already added to auth middleware.');
    }
  } catch (err) {
    console.error('Error adding debugging to auth middleware:', err.message);
  }
}

// Run all checks and fixes
function runAllChecks() {
  console.log('Running authentication flow checks and fixes...\n');
  
  checkAndFixProxy();
  checkAndFixAuthToken();
  checkAndFixAppTokenLoading();
  checkAndFixAuthStateLogin();
  checkAndFixPrivateRoute();
  addDebuggingToAuthMiddleware();
  
  console.log('\nAll checks and fixes completed!');
  console.log('Please restart both the client and server applications to apply the changes.');
}

runAllChecks(); 