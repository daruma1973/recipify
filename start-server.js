/**
 * Recipify Server Starter
 * 
 * This script starts the Recipify server with the improved authentication system.
 * It checks for required environment variables and sets up the server.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'server/.env') });

// Check if .env file exists
const envPath = path.resolve(__dirname, 'server/.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file with default values...');
  
  // Create default .env file
  const defaultEnv = 
`JWT_SECRET=recipify_secret_key_${Math.random().toString(36).substring(2, 15)}
MONGO_URI=mongodb://localhost:27017/recipify
PORT=5001`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('.env file created successfully');
}

// Start the server
console.log('Starting Recipify server...');
const serverProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  env: process.env
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Handle server exit
serverProcess.on('exit', (code, signal) => {
  if (code) {
    console.error(`Server process exited with code ${code}`);
  } else if (signal) {
    console.error(`Server process was killed with signal ${signal}`);
  } else {
    console.log('Server process exited');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping server...');
  serverProcess.kill('SIGINT');
});

console.log('Server started. Press Ctrl+C to stop.'); 