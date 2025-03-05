# Start Recipify application (both frontend and backend)
Write-Host "Starting Recipify application..." -ForegroundColor Yellow
Write-Host "This script will start both the backend server and frontend client." -ForegroundColor Yellow

# Create a function to check if a port is in use
function Test-PortInUse {
    param ($port)
    
    $connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | 
                  Where-Object { $_.LocalPort -eq $port }
    
    return ($null -ne $connections)
}

# Variables for the process IDs
$serverProcessId = $null
$clientProcessId = $null

# Start the backend server in a new PowerShell window
Write-Host "Starting backend server..." -ForegroundColor Cyan
$serverProcess = Start-Process powershell -ArgumentList "-Command cd $PSScriptRoot/server; npm run dev" -PassThru -WindowStyle Normal

# Wait a bit for server to initialize
Write-Host "Waiting for server to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Start the frontend client in a new PowerShell window
Write-Host "Starting frontend client..." -ForegroundColor Cyan
$clientProcess = Start-Process powershell -ArgumentList "-Command cd $PSScriptRoot/client; npm start" -PassThru -WindowStyle Normal

Write-Host "`nApplication is starting!" -ForegroundColor Green
Write-Host "Backend server is running in a separate window." -ForegroundColor Green
Write-Host "Frontend client is running in a separate window." -ForegroundColor Green
Write-Host "`nWhen asked if you want to run on a different port (if port 3000 is in use), type 'Y'." -ForegroundColor Yellow
Write-Host "`nTo stop all processes, run ./stop-app.ps1" -ForegroundColor Cyan 