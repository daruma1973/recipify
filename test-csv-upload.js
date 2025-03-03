/**
 * Test CSV Upload Functionality
 * 
 * This script tests the CSV upload functionality by making a direct API call
 * to upload the ingredient template CSV file.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Get token from command line or use a default test token
const token = process.argv[2] || 'dummy-token-for-development';

// First, let's try to get a real token by logging in
async function getAuthToken() {
  try {
    console.log('Attempting to get authentication token...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (loginResponse.data && loginResponse.data.token) {
      console.log('Successfully obtained authentication token');
      return loginResponse.data.token;
    } else {
      console.log('Login successful but no token received, using default token');
      return token;
    }
  } catch (err) {
    console.log('Failed to get authentication token, using default token');
    console.log('Error:', err.message);
    return token;
  }
}

async function testCSVUpload() {
  console.log('Testing CSV upload functionality...');
  
  try {
    // Get authentication token
    const authToken = await getAuthToken();
    
    // Check if template file exists
    const templatePath = path.join(__dirname, 'ingredient-template.csv');
    if (!fs.existsSync(templatePath)) {
      console.error('Template file not found:', templatePath);
      return;
    }
    
    console.log('Template file found:', templatePath);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(templatePath));
    
    console.log('Uploading CSV file to API...');
    console.log('Using token:', authToken.substring(0, 10) + '...');
    
    // Make API request
    const response = await axios.post('http://localhost:5000/api/ingredients/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        'x-auth-token': authToken
      }
    });
    
    console.log('\nAPI Response:');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    console.log('Success:', response.data.success);
    console.log('Results:', response.data.results.length);
    console.log('Errors:', response.data.errors.length);
    
    if (response.data.errors.length > 0) {
      console.log('\nErrors:');
      response.data.errors.forEach(error => {
        console.log(`- Row ${error.row}: ${error.name || 'Unknown'} - ${error.error}`);
      });
    }
    
    if (response.data.results.length > 0) {
      console.log('\nSuccessfully imported:');
      response.data.results.forEach(result => {
        console.log(`- ${result.name} (Row ${result.row})`);
      });
    }
    
    console.log('\nTest completed successfully!');
  } catch (err) {
    console.error('Error testing CSV upload:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

// Run the test
testCSVUpload(); 