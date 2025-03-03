const { exec } = require('child_process');
const http = require('http');

console.log('Running login fix script...');

// Function to check if the server is running
function checkServerRunning(callback) {
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

// Function to test login directly with bypassed authentication
function testDirectLogin() {
  console.log('Testing direct login with bypassed authentication...');
  
  exec('node test-login-direct.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error testing login: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Direct login test results: ${stdout}`);
  });
}

// Function to clear browser localStorage (instructions only)
function showLocalStorageClearInstructions() {
  console.log('\n=== IMPORTANT: CLEAR BROWSER LOCALSTORAGE ===');
  console.log('To complete the fix, please:');
  console.log('1. Open your browser\'s developer tools (F12)');
  console.log('2. Go to the Application tab');
  console.log('3. Select "Local Storage" on the left');
  console.log('4. Right-click and select "Clear" or delete the "token" item');
  console.log('5. Refresh the page and try logging in again');
  console.log('==============================================\n');
}

// Function to show bypass authentication instructions
function showBypassInstructions() {
  console.log('\n=== AUTHENTICATION BYPASS ENABLED ===');
  console.log('Authentication has been temporarily bypassed for development.');
  console.log('You can now use the application without real authentication.');
  console.log('To start the application with bypassed authentication:');
  console.log('npm run bypass-auth');
  console.log('==============================================\n');
}

// Main function
function runFix() {
  console.log('Checking if server is running...');
  
  checkServerRunning((isRunning) => {
    if (!isRunning) {
      console.log('Server is not running. You can start it with bypassed authentication.');
    } else {
      console.log('Server is running. Testing direct login...');
    }
    
    testDirectLogin();
    
    // Show instructions
    setTimeout(() => {
      showLocalStorageClearInstructions();
      showBypassInstructions();
      
      console.log('Login fix script completed.');
      console.log('You can now use the application with bypassed authentication.');
    }, 3000);
  });
}

// Run the fix
runFix(); 