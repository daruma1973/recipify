@echo off
echo Stopping all Node.js processes...

:: Kill node processes
taskkill /F /IM node.exe /T

:: Kill npm processes
taskkill /F /IM npm.exe /T

echo All Node.js processes have been stopped.
echo You can now start the application again with start-app.bat
pause 