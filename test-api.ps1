# Test Job Seeker Signup
Write-Host "Testing Job Seeker Signup..." -ForegroundColor Cyan
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "+1234567890"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/job-seeker/signup" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✓ Signup successful!" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "✗ Signup failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`n---`n"

# Test Job Seeker Login
Write-Host "Testing Job Seeker Login..." -ForegroundColor Cyan
$loginBody = @{
    emailOrPhone = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/job-seeker/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "✗ Login failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
