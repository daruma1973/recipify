/**
 * Authentication Fix Script
 * 
 * This script helps diagnose and fix authentication issues in the Recipify app.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

// Configuration
const SERVER_URL = 'http://localhost:5000';

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

// Test authentication
async function testAuth() {
  console.log('Testing authentication...');
  
  try {
    const loginResponse = await axios.post(`${SERVER_URL}/api/auth`, {
      email: 'admin@recipify.com',
      password: 'admin123'
    });
    
    if (loginResponse.data && loginResponse.data.token) {
      console.log('Authentication successful!');
      console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
      
      // Test token by getting user data
      try {
        const userResponse = await axios.get(`${SERVER_URL}/api/auth`, {
          headers: {
            'x-auth-token': loginResponse.data.token
          }
        });
        
        console.log('User data retrieved successfully:');
        console.log('- Name:', userResponse.data.name);
        console.log('- Email:', userResponse.data.email);
        console.log('- Role:', userResponse.data.role);
        
        return {
          success: true,
          token: loginResponse.data.token,
          user: userResponse.data
        };
      } catch (userErr) {
        console.error('Error retrieving user data:');
        if (userErr.response) {
          console.error('Status:', userErr.response.status);
          console.error('Data:', userErr.response.data);
        } else {
          console.error(userErr.message);
        }
        
        return {
          success: false,
          stage: 'user_data',
          error: userErr.message
        };
      }
    } else {
      console.log('Login successful but no token received');
      return {
        success: false,
        stage: 'login',
        error: 'No token received'
      };
    }
  } catch (err) {
    console.error('Authentication failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
    
    return {
      success: false,
      stage: 'login',
      error: err.message
    };
  }
}

// Test ingredient upload with authentication
async function testIngredientUpload(token) {
  console.log('Testing ingredient upload with authentication...');
  
  if (!token) {
    console.error('No token provided for upload test');
    return false;
  }
  
  // Create a test CSV file
  const testFilePath = path.join(__dirname, 'test-auth-upload.csv');
  const testContent = `name,category,unit,costPerUnit,inStock,minStockLevel,description,supplier,notes
Auth Test Ingredient,Test,kg,10.99,5,2,Test ingredient for auth upload,Test Supplier,Created by auth-fix.js`;
  
  try {
    fs.writeFileSync(testFilePath, testContent);
    console.log('Test CSV file created successfully at:', testFilePath);
  } catch (err) {
    console.error('Failed to create test CSV file:', err.message);
    return false;
  }
  
  try {
    // Create form data
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    
    console.log('Uploading CSV file to API with token...');
    console.log('Token being used:', token.substring(0, 20) + '...');
    
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
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    
    return true;
  } catch (err) {
    console.error('Error testing authenticated upload:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
    
    // Clean up test file if it exists
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    
    return false;
  }
}

// Main function
async function main() {
  console.log('=== Authentication Fix ===');
  
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
  
  const authResult = await testAuth();
  
  if (authResult.success) {
    console.log('\n✅ Authentication is working correctly!');
    
    // Test ingredient upload with the token
    const uploadResult = await testIngredientUpload(authResult.token);
    
    if (uploadResult) {
      console.log('\n✅ Authenticated upload is working correctly!');
    } else {
      console.log('\n❌ Authenticated upload is not working correctly.');
      console.log('Please check the server logs for more details.');
    }
    
    console.log('\nInstructions for the client application:');
    console.log('1. Make sure you are logged in');
    console.log('2. Check the browser console for any authentication errors');
    console.log('3. If you see "No token, authorization denied" errors:');
    console.log('   - Open your browser\'s developer tools (F12)');
    console.log('   - Go to the Application tab');
    console.log('   - Select "Local Storage" on the left');
    console.log('   - Check if there is a "token" item');
    console.log('   - If not, log out and log back in');
    console.log('4. If problems persist, try clearing your browser cache and cookies');
  } else {
    console.log('\n❌ Authentication is not working correctly.');
    console.log('Failed at stage:', authResult.stage);
    console.log('Error:', authResult.error);
    
    if (authResult.stage === 'login') {
      console.log('\nTrying to recreate admin user...');
      exec('node create-admin.js', (error, stdout, stderr) => {
        if (error) {
          console.error('Failed to create admin user:', error);
        } else {
          console.log(stdout);
          console.log('Please run this script again to test authentication with the new admin user.');
        }
      });
    }
  }
}

// Run the main function
main(); 