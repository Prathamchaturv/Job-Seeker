# AI Resume Builder - Backend Startup Script
# This script starts the backend server with the fixed code

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host " STARTING BACKEND SERVER" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host "`n===========================================`n" -ForegroundColor Cyan

Write-Host "Location: D:\Projects\1\backend" -ForegroundColor Gray
Write-Host "Port: 3001" -ForegroundColor Gray
Write-Host ""

Write-Host "Starting npm..." -ForegroundColor Yellow
Write-Host ""

npm run start:dev

# Keep terminal open if it fails
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n" -ForegroundColor Red
    Write-Host "Backend failed to start!" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
