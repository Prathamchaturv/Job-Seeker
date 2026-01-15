Write-Host "`n=== TESTING AI RESUME BUILDER FIX ===" -ForegroundColor Cyan
Write-Host ""

# Login first
Write-Host "1. Logging in..." -ForegroundColor Yellow
$loginData = @{
    emailOrPhone = "john.doe@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/job-seeker/login" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    $token = $loginResult.access_token
    Write-Host "   ✓ Login successful" -ForegroundColor Green
    Write-Host ""
    
    # Test AI Resume Builder
    Write-Host "2. Testing AI Resume Builder..." -ForegroundColor Yellow
    
    $resumeData = @{
        userProfile = @{
            name = "Pratham Chaturvedi"
            currentRole = "Full Stack Developer"
            experience = "2 Years"
            skills = @("React", "Node.js", "HTML", "CSS", "SQL")
            education = "B.Tech CS AIML and IOT"
            achievements = @("Performance optimization")
            projects = @("Real-time chatbot")
        }
        targetRole = "Senior Full Stack Developer"
    } | ConvertTo-Json -Depth 5
    
    Write-Host "   Sending request to AI..." -ForegroundColor Gray
    
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $resumeResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/ai/build-resume" `
        -Method POST `
        -Body $resumeData `
        -Headers $headers `
        -ContentType "application/json" `
        -UseBasicParsing `
        -TimeoutSec 30
    
    $result = $resumeResponse.Content | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "   ✅ SUCCESS! AI Resume Generated" -ForegroundColor Green -BackgroundColor DarkGreen
    Write-Host ""
    
    Write-Host "   Resume Details:" -ForegroundColor Cyan
    if ($result.data.contactInfo) {
        Write-Host "   ├─ Name: $($result.data.contactInfo.name)" -ForegroundColor White
        Write-Host "   ├─ Email: $($result.data.contactInfo.email)" -ForegroundColor White
    }
    if ($result.data.summary) {
        $summaryPreview = $result.data.summary.Substring(0, [Math]::Min(80, $result.data.summary.Length)) + "..."
        Write-Host "   ├─ Summary: $summaryPreview" -ForegroundColor White
    }
    if ($result.data.education) {
        Write-Host "   ├─ Education: $($result.data.education.Count) entry(ies)" -ForegroundColor White
    }
    if ($result.data.experience) {
        Write-Host "   ├─ Experience: $($result.data.experience.Count) entry(ies)" -ForegroundColor White
    }
    if ($result.data.projects) {
        Write-Host "   ├─ Projects: $($result.data.projects.Count) entry(ies)" -ForegroundColor White
    }
    if ($result.data.skills) {
        Write-Host "   ├─ Skills: Technical, Soft, Tools" -ForegroundColor White
    }
    if ($result.data.suggestions) {
        Write-Host "   └─ Suggestions: $($result.data.suggestions.Count) recommendation(s)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "   🎉 AI Resume Builder is working!" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "   ❌ FAILED!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    
    if ($_.ErrorDetails) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "   Troubleshooting:" -ForegroundColor Cyan
    Write-Host "   1. Make sure backend restarted after code changes" -ForegroundColor Gray
    Write-Host "   2. Check backend console for detailed errors" -ForegroundColor Gray
    Write-Host "   3. Verify Gemini API key is set in backend/.env" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
