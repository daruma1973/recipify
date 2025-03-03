/**
 * Recipify Authentication Tests Runner
 * 
 * This script runs all the authentication tests for the Recipify application.
 */

const { spawn } = require('child_process');
const path = require('path');

// List of test scripts to run
const tests = [
  { name: 'Verify Authentication System', script: 'verify-auth-system.js' },
  { name: 'Test Login', script: 'test-login.js' },
  { name: 'Test Authentication Flow', script: 'test-auth.js' },
  { name: 'Check User', script: 'check-user.js' }
];

// Run a test script
const runTest = (test) => {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Running ${test.name} ===\n`);
    
    const testProcess = spawn('node', [test.script], {
      stdio: 'inherit'
    });
    
    testProcess.on('error', (err) => {
      console.error(`Error running ${test.name}:`, err);
      reject(err);
    });
    
    testProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`\n=== ${test.name} completed successfully ===\n`);
        resolve();
      } else {
        console.error(`\n=== ${test.name} failed with code ${code} ===\n`);
        resolve(); // Continue with next test even if this one fails
      }
    });
  });
};

// Run all tests sequentially
const runAllTests = async () => {
  console.log('Starting authentication tests...\n');
  
  for (const test of tests) {
    try {
      await runTest(test);
    } catch (err) {
      console.error('Test execution error:', err);
    }
  }
  
  console.log('\nAll tests completed.');
};

// Run the tests
runAllTests().catch(err => {
  console.error('Unhandled error:', err);
}); 