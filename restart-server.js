const { exec } = require('child_process');
const http = require('http');

console.log('Checking if server is running...');

// Function to check if the server is running
function checkServerRunning(port, callback) {
  const options = {
    host: 'localhost',
    port: port,
    path: '/api/test',
    timeout: 2000
  };

  const req = http.get(options, (res) => {
    console.log(`Server is running on port ${port}, status: ${res.statusCode}`);
    callback(true);
  });

  req.on('error', (err) => {
    console.log(`Server is not running on port ${port}: ${err.message}`);
    callback(false);
  });

  req.on('timeout', () => {
    console.log(`Request timed out checking port ${port}`);
    req.destroy();
    callback(false);
  });
}

// Function to kill processes on a specific port
function killProcessOnPort(port, callback) {
  console.log(`Attempting to kill process on port ${port}...`);
  
  // For Windows
  exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`No process found on port ${port}`);
      callback();
      return;
    }

    // Parse the output to get the PID
    const lines = stdout.trim().split('\n');
    if (lines.length > 0) {
      const pidMatch = lines[0].match(/(\d+)$/);
      if (pidMatch && pidMatch[1]) {
        const pid = pidMatch[1];
        console.log(`Found process with PID ${pid} on port ${port}, killing it...`);
        
        exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`Error killing process: ${error.message}`);
          } else {
            console.log(`Process with PID ${pid} killed successfully`);
          }
          callback();
        });
      } else {
        console.log(`Could not extract PID from netstat output`);
        callback();
      }
    } else {
      console.log(`No process found on port ${port}`);
      callback();
    }
  });
}

// Function to start the server
function startServer() {
  console.log('Starting server...');
  
  const server = exec('node server/index.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Server stderr: ${stderr}`);
    }
  });

  server.stdout.on('data', (data) => {
    console.log(`Server output: ${data}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });

  console.log('Server process started');
}

// Check if server is running on port 5000
checkServerRunning(5000, (isRunning) => {
  if (isRunning) {
    console.log('Server is already running on port 5000');
    console.log('Killing the existing server process...');
    
    killProcessOnPort(5000, () => {
      console.log('Starting a new server instance...');
      setTimeout(startServer, 1000);
    });
  } else {
    console.log('Server is not running, starting it...');
    startServer();
  }
});

console.log('Server restart script completed. Check the console for server output.'); 