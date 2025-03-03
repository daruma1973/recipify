/**
 * Fix Port Issue
 * 
 * This script helps resolve the EADDRINUSE error by finding and killing
 * processes that are using port 5000.
 */

const { exec } = require('child_process');

console.log('=== Port 5000 Fix ===');
console.log('Checking for processes using port 5000...');

// For Windows
if (process.platform === 'win32') {
  exec('netstat -ano | findstr :5000', (error, stdout, stderr) => {
    if (error) {
      console.log('No processes found using port 5000');
      return;
    }

    console.log('Found processes using port 5000:');
    console.log(stdout);

    const lines = stdout.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 4) {
        const pid = parts[parts.length - 1];
        pids.add(pid);
      }
    });

    if (pids.size === 0) {
      console.log('No PIDs found to kill');
      return;
    }

    console.log('Attempting to kill the following PIDs:', Array.from(pids).join(', '));

    pids.forEach(pid => {
      exec(`taskkill /F /PID ${pid}`, (killError, killStdout, killStderr) => {
        if (killError) {
          console.error(`Failed to kill process ${pid}:`, killError);
          return;
        }
        console.log(`Successfully killed process ${pid}`);
      });
    });
  });
} else {
  // For Unix-like systems (Linux, macOS)
  exec('lsof -i :5000 | grep LISTEN', (error, stdout, stderr) => {
    if (error) {
      console.log('No processes found using port 5000');
      return;
    }

    console.log('Found processes using port 5000:');
    console.log(stdout);

    const lines = stdout.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 1) {
        pids.add(parts[1]);
      }
    });

    if (pids.size === 0) {
      console.log('No PIDs found to kill');
      return;
    }

    console.log('Attempting to kill the following PIDs:', Array.from(pids).join(', '));

    pids.forEach(pid => {
      exec(`kill -9 ${pid}`, (killError, killStdout, killStderr) => {
        if (killError) {
          console.error(`Failed to kill process ${pid}:`, killError);
          return;
        }
        console.log(`Successfully killed process ${pid}`);
      });
    });
  });
}

// Check if port is free after killing processes
setTimeout(() => {
  const checkCommand = process.platform === 'win32' 
    ? 'netstat -ano | findstr :5000' 
    : 'lsof -i :5000 | grep LISTEN';
  
  exec(checkCommand, (error, stdout, stderr) => {
    if (error || stdout.trim() === '') {
      console.log('Port 5000 is now free! You can restart your server.');
    } else {
      console.log('Port 5000 is still in use by some processes:');
      console.log(stdout);
      console.log('You may need to restart your computer to free up the port.');
    }
  });
}, 2000); 