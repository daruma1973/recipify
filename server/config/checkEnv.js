const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Check if required environment variables are set
 * If not, create or update .env file with default values
 */
const checkEnvironmentVariables = () => {
  const envPath = path.resolve(__dirname, '../.env');
  let envVars = {};
  
  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length === 2) {
        envVars[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  
  // Check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.log('JWT_SECRET environment variable not set');
    
    // Generate a random string if not set
    if (!envVars.JWT_SECRET) {
      envVars.JWT_SECRET = 'recipify_secret_key_' + Math.random().toString(36).substring(2, 15);
      console.log('Generated new JWT_SECRET');
    }
  }
  
  // Check for MONGO_URI
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI environment variable not set');
    
    // Set default MongoDB URI if not set
    if (!envVars.MONGO_URI) {
      envVars.MONGO_URI = 'mongodb://localhost:27017/recipify';
      console.log('Set default MONGO_URI');
    }
  }
  
  // Write updated .env file
  let envContent = '';
  Object.keys(envVars).forEach(key => {
    envContent += `${key}=${envVars[key]}\n`;
  });
  
  if (envContent) {
    fs.writeFileSync(envPath, envContent);
    console.log('.env file updated with required variables');
    
    // Reload environment variables
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key];
    });
  }
};

module.exports = checkEnvironmentVariables; 