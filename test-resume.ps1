Write-Host "`n🧪 TESTING AI RESUME BUILDER..." -ForegroundColor Cyan

# Step 1: Login
Write-Host "`n1. Logging in..." -ForegroundColor Gray
$loginData = @{
    emailOrPhone = "john.doe@example.com"
    password = "Password123!"
} | ConvertTo-Json

$loginRes = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/job-seeker/login" -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing
$token = ($loginRes.Content | ConvertFrom-Json).access_token
Write-Host "   ✅ Logged in" -ForegroundColor Green

# Step 2: Build Resume
Write-Host "`n2. Generating resume with AI..." -ForegroundColor Gray
Write-Host "   ⏳ Please wait 10-15 seconds..." -ForegroundColor Yellow

$resumeData = @{
    userProfile = @{
        name = "Pratham Chaturvedi"
        currentRole = "Full Stack Developer"
        experience = "2 Years"
        skills = @("React", "Node.js", "TypeScript", "HTML", "CSS", "SQL")
        education = "B.Tech CS (AIML and IoT)"
        achievements = @("Performance optimization", "Team leadership")
        projects = @("Real-time chatbot", "E-commerce platform")
    }
    targetRole = "Senior Full Stack Developer"
} | ConvertTo-Json -Depth 5

try {
    $resumeRes = Invoke-WebRequest -Uri "http://localhost:3001/api/ai/build-resume" -Method POST -Body $resumeData -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing -TimeoutSec 60
    
    $result = $resumeRes.Content | ConvertFrom-Json
    
    Write-Host "`n🎉 SUCCESS! RESUME GENERATED!" -ForegroundColor Green -BackgroundColor DarkGreen
    Write-Host "`n📋 Resume Details:" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Name: $($result.data.contactInfo.name)" -ForegroundColor Cyan
    Write-Host "Email: $($result.data.contactInfo.email)" -ForegroundColor Cyan
    Write-Host "`nSummary:" -ForegroundColor Yellow
    Write-Host "$($result.data.summary)" -ForegroundColor White
    Write-Host "`nEducation: $($result.data.education.Count) entries" -ForegroundColor Gray
    Write-Host "Experience: $($result.data.experience.Count) entries" -ForegroundColor Gray
    Write-Host "Projects: $($result.data.projects.Count) entries" -ForegroundColor Gray
    Write-Host "Technical Skills: $($result.data.skills.technical.Count)" -ForegroundColor Gray
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    Write-Host "`n✅ AI RESUME BUILDER IS WORKING!" -ForegroundColor Green -BackgroundColor DarkGreen
    Write-Host "`n📱 NOW IN YOUR BROWSER:" -ForegroundColor Cyan
    Write-Host "   1. Refresh the page (F5)" -ForegroundColor White
    Write-Host "   2. Fill the form" -ForegroundColor White
    Write-Host "   3. Click 'Generate AI Resume'" -ForegroundColor White
    Write-Host "   4. It will work!" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "`n❌ FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) {
        $errorData = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorData.message)" -ForegroundColor Red
    }
}
