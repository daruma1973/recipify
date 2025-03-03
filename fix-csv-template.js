/**
 * Fix CSV Template Download
 * 
 * This script checks and fixes issues with the CSV template download functionality.
 * It verifies that the template file exists and is accessible, and tests both
 * the authenticated and public endpoints.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

// Configuration
const SERVER_URL = 'http://localhost:5000';
const TEMPLATE_PATH = path.join(__dirname, 'ingredient-template.csv');
const TEMPLATE_BACKUP_PATH = path.join(__dirname, 'ingredient-template.backup.csv');
const TEMPLATE_CONTENT = `name,category,unit,costPerUnit,inStock,minStockLevel,description,supplier,notes
Olive Oil,Oil,liter,12.99,5,2,Extra virgin olive oil,Olive Farms,Cold pressed
Flour,Dry Goods,kg,1.50,10,5,All-purpose flour,Baker's Supply,Unbleached
Salt,Spices,kg,0.80,3,1,Sea salt,Seasoning Co.,Fine grain
Chicken Breast,Meat,kg,8.99,4,2,Boneless skinless chicken breast,Poultry Farm,Organic
Garlic,Produce,kg,5.99,1,0.5,Fresh garlic,Local Farm,Organic`;

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

// Check if template file exists
function checkTemplateFile() {
  console.log('Checking if template file exists...');
  
  if (fs.existsSync(TEMPLATE_PATH)) {
    console.log('Template file exists.');
    
    // Backup the existing template
    fs.copyFileSync(TEMPLATE_PATH, TEMPLATE_BACKUP_PATH);
    console.log('Created backup of existing template at:', TEMPLATE_BACKUP_PATH);
    
    return true;
  } else {
    console.error('Template file does not exist. Creating it...');
    
    try {
      fs.writeFileSync(TEMPLATE_PATH, TEMPLATE_CONTENT);
      console.log('Template file created successfully.');
      return true;
    } catch (err) {
      console.error('Failed to create template file:', err.message);
      return false;
    }
  }
}

// Test public endpoint
async function testPublicEndpoint() {
  console.log('Testing public template endpoint...');
  
  try {
    const response = await axios.get(`${SERVER_URL}/api/ingredients/test-template`, {
      responseType: 'stream'
    });
    
    const outputPath = path.join(__dirname, 'public-template-test.csv');
    const writer = fs.createWriteStream(outputPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    console.log('Public endpoint test successful. File saved to:', outputPath);
    return true;
  } catch (err) {
    console.error('Public endpoint test failed:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
    }
    return false;
  }
}

// Test authenticated endpoint
async function testAuthEndpoint() {
  console.log('Testing authenticated template endpoint...');
  
  try {
    // Try to get a token first
    console.log('Attempting to get authentication token...');
    
    const loginResponse = await axios.post(`${SERVER_URL}/api/auth`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (!loginResponse.data || !loginResponse.data.token) {
      console.error('Login successful but no token received.');
      return false;
    }
    
    const token = loginResponse.data.token;
    console.log('Authentication token received.');
    
    // Test the authenticated endpoint
    const response = await axios.get(`${SERVER_URL}/api/ingredients/template`, {
      responseType: 'stream',
      headers: {
        'x-auth-token': token
      }
    });
    
    const outputPath = path.join(__dirname, 'auth-template-test.csv');
    const writer = fs.createWriteStream(outputPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    console.log('Authenticated endpoint test successful. File saved to:', outputPath);
    return true;
  } catch (err) {
    console.error('Authenticated endpoint test failed:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      if (err.response.data) {
        console.error('Data:', err.response.data);
      }
    }
    return false;
  }
}

// Check permissions on the template file
function checkPermissions() {
  console.log('Checking file permissions...');
  
  try {
    // Make sure the file is readable
    fs.accessSync(TEMPLATE_PATH, fs.constants.R_OK);
    console.log('Template file is readable.');
    
    // Get file stats
    const stats = fs.statSync(TEMPLATE_PATH);
    console.log('File size:', stats.size, 'bytes');
    console.log('Last modified:', stats.mtime);
    
    return true;
  } catch (err) {
    console.error('Permission check failed:', err.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== CSV Template Download Fix ===');
  
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
  
  const templateExists = checkTemplateFile();
  if (!templateExists) {
    console.error('Cannot proceed without template file.');
    return;
  }
  
  const permissionsOk = checkPermissions();
  if (!permissionsOk) {
    console.error('Permission issues with template file.');
  }
  
  const publicEndpointOk = await testPublicEndpoint();
  if (!publicEndpointOk) {
    console.error('Public endpoint is not working properly.');
  }
  
  const authEndpointOk = await testAuthEndpoint();
  if (!authEndpointOk) {
    console.error('Authenticated endpoint is not working properly.');
  }
  
  console.log('\n=== Summary ===');
  console.log('Server running:', serverRunning ? '✅' : '❌');
  console.log('Template file exists:', templateExists ? '✅' : '❌');
  console.log('File permissions:', permissionsOk ? '✅' : '❌');
  console.log('Public endpoint:', publicEndpointOk ? '✅' : '❌');
  console.log('Authenticated endpoint:', authEndpointOk ? '✅' : '❌');
  
  if (serverRunning && templateExists && permissionsOk && (publicEndpointOk || authEndpointOk)) {
    console.log('\n✅ CSV template download should now be working!');
    console.log('If you still have issues, please check the browser console for more details.');
  } else {
    console.log('\n❌ Some issues remain. Please check the logs above for details.');
  }
}

// Run the main function
main(); 