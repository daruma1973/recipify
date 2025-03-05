@echo off
echo Starting Recipify application...
echo This script will start both the backend server and frontend client.

:: Start the backend server in a new window
echo Starting backend server...
start cmd /k "cd %~dp0server && npm run dev"

:: Wait a bit for server to initialize
echo Waiting for server to initialize...
timeout /t 5 /nobreak > nul

:: Start the frontend client in a new window
echo Starting frontend client...
start cmd /k "cd %~dp0client && npm start"

echo.
echo Application is starting!
echo Backend server is running in a separate window.
echo Frontend client is running in a separate window.
echo.
echo When asked if you want to run on a different port (if port 3000 is in use), type 'Y'.
echo.
echo To stop all processes, run stop-app.bat
pause 