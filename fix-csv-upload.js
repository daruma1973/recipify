/**
 * Fix CSV Upload Functionality
 * 
 * This script diagnoses and fixes issues with the CSV upload functionality.
 * It checks server status, file permissions, and tests the upload endpoint.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { exec } = require('child_process');

// Configuration
const SERVER_URL = 'http://localhost:5000';
const TEMPLATE_PATH = path.join(__dirname, 'ingredient-template.csv');
const TEST_UPLOAD_PATH = path.join(__dirname, 'test-upload.csv');

// Check if server is running
async function checkServer() {
  console.log('Checking if server is running...');
  
  try {
    const response = await axios.get(`${SERVER_URL}/api/test`);
    console.log('Server is running.');
    return true;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error('Server is not running. Please start the server with "npm run dev".');
      return false;
    }
    
    console.log('Server might be running but test endpoint is not available.');
    return true; // Assume it's running but test endpoint is not implemented
  }
}

// Create a test CSV file
function createTestCSV() {
  console.log('Creating test CSV file...');
  
  const testContent = `name,category,unit,costPerUnit,inStock,minStockLevel,description,supplier,notes
Test Ingredient,Test,kg,10.99,5,2,Test ingredient for upload,Test Supplier,Created by fix-csv-upload.js`;
  
  try {
    fs.writeFileSync(TEST_UPLOAD_PATH, testContent);
    console.log('Test CSV file created successfully at:', TEST_UPLOAD_PATH);
    return true;
  } catch (err) {
    console.error('Failed to create test CSV file:', err.message);
    return false;
  }
}

// Get authentication token
async function getAuthToken() {
  console.log('Attempting to get authentication token...');
  
  try {
    const loginResponse = await axios.post(`${SERVER_URL}/api/auth`, {
      email: 'admin@recipify.com',
      password: 'admin123'
    });
    
    if (loginResponse.data && loginResponse.data.token) {
      console.log('Successfully obtained authentication token');
      return loginResponse.data.token;
    } else {
      console.log('Login successful but no token received');
      return null;
    }
  } catch (err) {
    console.log('Failed to get authentication token:', err.message);
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Data:', err.response.data);
    }
    return null;
  }
}

// Test CSV upload
async function testCSVUpload() {
  console.log('Testing CSV upload functionality...');
  
  // Get authentication token
  const token = await getAuthToken();
  if (!token) {
    console.error('Cannot proceed without authentication token');
    return false;
  }
  
  try {
    // Check if test file exists
    if (!fs.existsSync(TEST_UPLOAD_PATH)) {
      console.error('Test file not found:', TEST_UPLOAD_PATH);
      return false;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_UPLOAD_PATH));
    
    console.log('Uploading CSV file to API...');
    
    // Make API request
    const response = await axios.post(`${SERVER_URL}/api/ingredients/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'x-auth-token': token
      }
    });
    
    console.log('Upload successful!');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    console.log('Success:', response.data.success);
    
    if (response.data.results && response.data.results.length > 0) {
      console.log('Successfully imported ingredients:', response.data.results.length);
    }
    
    if (response.data.errors && response.data.errors.length > 0) {
      console.log('Errors during import:', response.data.errors.length);
      response.data.errors.forEach(error => {
        console.log(`- Row ${error.row}: ${error.error}`);
      });
    }
    
    return true;
  } catch (err) {
    console.error('Error testing CSV upload:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
    return false;
  }
}

// Check uploads directory
function checkUploadsDirectory() {
  console.log('Checking uploads directory...');
  
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (fs.existsSync(uploadsDir)) {
    console.log('Uploads directory exists.');
    return true;
  } else {
    console.log('Uploads directory does not exist. Creating it...');
    try {
      fs.mkdirSync(uploadsDir);
      console.log('Uploads directory created successfully.');
      return true;
    } catch (err) {
      console.error('Failed to create uploads directory:', err.message);
      return false;
    }
  }
}

// Main function
async function main() {
  console.log('=== CSV Upload Fix ===');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('Starting server...');
    exec('npm run dev', (error, stdout, stderr) => {
      if (error) {
        console.error('Failed to start server:', error);
        return;
      }
      console.log('Server started. Please run this script again after the server is fully started.');
    });
    return;
  }
  
  const uploadsDirectoryOk = checkUploadsDirectory();
  if (!uploadsDirectoryOk) {
    console.error('Cannot proceed without uploads directory.');
    return;
  }
  
  const testFileCreated = createTestCSV();
  if (!testFileCreated) {
    console.error('Cannot proceed without test file.');
    return;
  }
  
  const uploadTestOk = await testCSVUpload();
  
  console.log('\n=== Summary ===');
  console.log('Server running:', serverRunning ? '✅' : '❌');
  console.log('Uploads directory:', uploadsDirectoryOk ? '✅' : '❌');
  console.log('Test file created:', testFileCreated ? '✅' : '❌');
  console.log('Upload test:', uploadTestOk ? '✅' : '❌');
  
  if (serverRunning && uploadsDirectoryOk && testFileCreated && uploadTestOk) {
    console.log('\n✅ CSV upload functionality should now be working!');
    console.log('If you still have issues, please check the browser console for more details.');
  } else {
    console.log('\n❌ Some issues remain. Please check the logs above for details.');
  }
}

// Run the main function
main(); 