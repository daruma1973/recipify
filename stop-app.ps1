# Stop all Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow

# Find all running node processes and stop them
Get-Process | Where-Object { $_.ProcessName -eq "node" -or $_.ProcessName -eq "nodejs" } | ForEach-Object {
    Write-Host "Stopping process: $($_.Id) - $($_.ProcessName)" -ForegroundColor Cyan
    Stop-Process -Id $_.Id -Force
}

# Also find any npm processes
Get-Process | Where-Object { $_.ProcessName -eq "npm" } | ForEach-Object {
    Write-Host "Stopping process: $($_.Id) - $($_.ProcessName)" -ForegroundColor Cyan
    Stop-Process -Id $_.Id -Force
}

# Find any nodemon processes
Get-Process | Where-Object { $_.ProcessName -eq "nodemon" } | ForEach-Object {
    Write-Host "Stopping process: $($_.Id) - $($_.ProcessName)" -ForegroundColor Cyan
    Stop-Process -Id $_.Id -Force
}

Write-Host "All Node.js processes have been stopped." -ForegroundColor Green
Write-Host "You can now start the application again with ./start-app.ps1" -ForegroundColor Green 