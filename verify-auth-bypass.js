/**
 * Verify Authentication Bypass
 * 
 * This script tests if the authentication bypass is working correctly
 * by checking various components and endpoints.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const API_URL = 'http://localhost:5000';
const DUMMY_TOKEN = 'dummy-token-for-development';
const TEST_CSV_PATH = path.join(__dirname, 'test-auth-bypass.csv');

// Create a test CSV file
function createTestCSV() {
  console.log('Creating test CSV file...');
  const csvContent = 'name,category,unit,cost,supplier\nTest Ingredient,Test Category,kg,10.00,Test Supplier';
  
  try {
    fs.writeFileSync(TEST_CSV_PATH, csvContent);
    console.log(`Test CSV file created at ${TEST_CSV_PATH}`);
    return true;
  } catch (err) {
    console.error('Error creating test CSV file:', err.message);
    return false;
  }
}

// Check if server is running
async function checkServer() {
  console.log('Checking if server is running...');
  try {
    const res = await axios.get(`${API_URL}/api/test`);
    console.log('Server is running:', res.status, res.data);
    return true;
  } catch (err) {
    if (err.response) {
      console.log('Server is running but returned an error:', err.response.status);
      return true;
    }
    console.error('Server is not running:', err.message);
    return false;
  }
}

// Test authentication bypass for getting ingredients
async function testGetIngredients() {
  console.log('\nTesting GET /api/ingredients endpoint...');
  try {
    const res = await axios.get(`${API_URL}/api/ingredients`, {
      headers: {
        'x-auth-token': DUMMY_TOKEN
      }
    });
    
    console.log('GET /api/ingredients successful:', res.status);
    console.log(`Retrieved ${res.data.length} ingredients`);
    return true;
  } catch (err) {
    console.error('Error getting ingredients:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    return false;
  }
}

// Test authentication bypass for downloading template
async function testDownloadTemplate() {
  console.log('\nTesting GET /api/ingredients/template endpoint...');
  try {
    const res = await axios.get(`${API_URL}/api/ingredients/template`, {
      responseType: 'blob',
      headers: {
        'x-auth-token': DUMMY_TOKEN
      }
    });
    
    console.log('GET /api/ingredients/template successful:', res.status);
    console.log('Template downloaded successfully');
    return true;
  } catch (err) {
    console.error('Error downloading template:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    return false;
  }
}

// Test authentication bypass for uploading CSV
async function testUploadCSV() {
  console.log('\nTesting POST /api/ingredients/upload endpoint...');
  
  if (!fs.existsSync(TEST_CSV_PATH)) {
    console.error('Test CSV file does not exist. Please run createTestCSV() first.');
    return false;
  }
  
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_CSV_PATH));
    
    const res = await axios.post(`${API_URL}/api/ingredients/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'x-auth-token': DUMMY_TOKEN
      }
    });
    
    console.log('POST /api/ingredients/upload successful:', res.status);
    console.log('Upload response:', res.data);
    return true;
  } catch (err) {
    console.error('Error uploading CSV:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    return false;
  }
}

// Main function
async function main() {
  console.log('=== VERIFYING AUTHENTICATION BYPASS ===\n');
  
  // Step 1: Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('Server is not running. Please start the server with "npm run dev".');
    return;
  }
  
  // Step 2: Create test CSV file
  const testFileCreated = createTestCSV();
  if (!testFileCreated) {
    console.error('Failed to create test CSV file.');
    return;
  }
  
  // Step 3: Test getting ingredients
  const getIngredientsOk = await testGetIngredients();
  
  // Step 4: Test downloading template
  const downloadTemplateOk = await testDownloadTemplate();
  
  // Step 5: Test uploading CSV
  const uploadCSVOk = await testUploadCSV();
  
  // Summary
  console.log('\n=== AUTHENTICATION BYPASS VERIFICATION SUMMARY ===');
  console.log('Server running:', serverRunning ? '✅ Yes' : '❌ No');
  console.log('Test file created:', testFileCreated ? '✅ Yes' : '❌ No');
  console.log('GET /api/ingredients:', getIngredientsOk ? '✅ Success' : '❌ Failed');
  console.log('GET /api/ingredients/template:', downloadTemplateOk ? '✅ Success' : '❌ Failed');
  console.log('POST /api/ingredients/upload:', uploadCSVOk ? '✅ Success' : '❌ Failed');
  
  if (serverRunning && testFileCreated && getIngredientsOk && downloadTemplateOk && uploadCSVOk) {
    console.log('\n✅ AUTHENTICATION BYPASS IS WORKING CORRECTLY!');
    console.log('You can now use all features without authentication.');
  } else {
    console.log('\n❌ AUTHENTICATION BYPASS IS NOT WORKING CORRECTLY.');
    console.log('Please check the errors above and fix the issues.');
  }
  
  // Clean up
  try {
    if (fs.existsSync(TEST_CSV_PATH)) {
      fs.unlinkSync(TEST_CSV_PATH);
      console.log('\nTest CSV file cleaned up.');
    }
  } catch (err) {
    console.error('Error cleaning up test file:', err.message);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
}); 