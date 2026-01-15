# Comprehensive AI Features Test Script
# Tests all AI features using Google Gemini API

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "    AI FEATURES COMPREHENSIVE TEST - Gemini 2.5 Flash    " -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3001/api"
$email = "john.doe@example.com"
$password = "Password123!"

# Test Results Storage
$testResults = @()

# Helper function to record test results
function Record-Test {
    param($name, $status, $details)
    $script:testResults += [PSCustomObject]@{
        Test = $name
        Status = $status
        Details = $details
    }
}

# Step 1: Check Backend
Write-Host "[1/7] Checking Backend Status..." -ForegroundColor Yellow
try {
    $ping = Invoke-WebRequest -Uri "$baseUrl" -Method GET -UseBasicParsing -TimeoutSec 3
    Write-Host "      ✅ Backend is running on port 3001" -ForegroundColor Green
    Record-Test "Backend Status" "✅ PASS" "Backend responding"
} catch {
    Write-Host "      ❌ Backend is not running!" -ForegroundColor Red
    Write-Host "      Please run: cd d:\Projects\1\backend && npm run start:dev" -ForegroundColor Yellow
    Record-Test "Backend Status" "❌ FAIL" "Backend not responding"
    exit
}

# Step 2: Login
Write-Host "`n[2/7] Authenticating User..." -ForegroundColor Yellow
$loginData = @{
    emailOrPhone = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest `
        -Uri "$baseUrl/auth/job-seeker/login" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $authData = $loginResponse.Content | ConvertFrom-Json
    $token = $authData.access_token
    $user = $authData.user
    
    Write-Host "      ✅ Logged in as: $($user.name)" -ForegroundColor Green
    Write-Host "         Email: $($user.email)" -ForegroundColor Gray
    Write-Host "         Role: $($user.role)" -ForegroundColor Gray
    Record-Test "Authentication" "✅ PASS" "Successfully logged in as $($user.name)"
} catch {
    Write-Host "      ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Record-Test "Authentication" "❌ FAIL" $_.Exception.Message
    exit
}

# Step 3: Test Mock Interview Question Generation
Write-Host "`n[3/7] AI Feature #1: Mock Interview Question Generation" -ForegroundColor Yellow
$mockInterviewData = @{
    jobRole = "Full Stack Developer"
    experienceLevel = "senior"
    numberOfQuestions = 3
} | ConvertTo-Json

try {
    Write-Host "      Generating 3 questions for Senior Full Stack Developer..." -ForegroundColor Gray
    $mockResponse = Invoke-WebRequest `
        -Uri "$baseUrl/ai/mock-interview" `
        -Method POST `
        -Body $mockInterviewData `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -UseBasicParsing `
        -TimeoutSec 60
    
    $mockResult = $mockResponse.Content | ConvertFrom-Json
    $questions = $mockResult.data.questions
    
    Write-Host "      ✅ Generated $($questions.Count) interview questions" -ForegroundColor Green
    $questions | ForEach-Object {
        Write-Host "         Q$($_.id): $($_.question.Substring(0, [Math]::Min(70, $_.question.Length)))..." -ForegroundColor Cyan
        Write-Host "           Type: $($_.type) | Difficulty: $($_.difficulty)" -ForegroundColor DarkGray
    }
    
    # Save questions for evaluation test
    $savedQuestions = $questions
    
    Record-Test "Mock Interview Generation" "✅ PASS" "Generated $($questions.Count) questions successfully"
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "         Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
    }
    Record-Test "Mock Interview Generation" "❌ FAIL" $_.Exception.Message
}

# Step 4: Test Interview Answer Evaluation
Write-Host "`n[4/7] AI Feature #2: Interview Answer Evaluation" -ForegroundColor Yellow

# Prepare test data
$testQuestions = @(
    @{
        id = 1
        question = "What is React?"
        type = "technical"
        difficulty = "easy"
        expectedAnswer = "A JavaScript library for building user interfaces"
    },
    @{
        id = 2
        question = "Explain the difference between REST and GraphQL"
        type = "technical"
        difficulty = "medium"
        expectedAnswer = "REST uses multiple endpoints while GraphQL uses single endpoint"
    }
)

$testAnswers = @(
    "React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It uses a component-based architecture and virtual DOM for efficient rendering.",
    "I don't know the answer to this question."
)

$evaluationData = @{
    questions = $testQuestions
    answers = $testAnswers
    role = "Frontend Developer"
} | ConvertTo-Json -Depth 5

try {
    Write-Host "      Evaluating 2 test answers..." -ForegroundColor Gray
    $evalResponse = Invoke-WebRequest `
        -Uri "$baseUrl/ai/evaluate-interview" `
        -Method POST `
        -Body $evaluationData `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -UseBasicParsing `
        -TimeoutSec 60
    
    $evalResult = $evalResponse.Content | ConvertFrom-Json
    
    Write-Host "      ✅ Evaluation complete" -ForegroundColor Green
    Write-Host "         Overall Score: $($evalResult.data.overallScore)%" -ForegroundColor $(if($evalResult.data.overallScore -ge 70){'Green'}else{'Yellow'})
    Write-Host "         Correct Answers: $($evalResult.data.correctAnswers)/$($evalResult.data.totalQuestions)" -ForegroundColor Cyan
    
    $evalResult.data.evaluations | ForEach-Object {
        $status = if($_.isCorrect){"✅ Correct"}else{"❌ Incorrect"}
        Write-Host "         Q$($_.questionId): Score $($_.evaluation.score)/10 - $status" -ForegroundColor $(if($_.isCorrect){'Green'}else{'Red'})
    }
    
    Record-Test "Interview Evaluation" "✅ PASS" "Evaluated $($evalResult.data.totalQuestions) answers successfully"
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "         Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
    }
    Record-Test "Interview Evaluation" "❌ FAIL" $_.Exception.Message
}

# Step 5: Test Resume-Job Matching
Write-Host "`n[5/7] AI Feature #3: Resume-Job Matching Analysis" -ForegroundColor Yellow
$resumeMatchData = @{
    resumeText = @"
John Doe
Software Engineer with 5 years of experience in full-stack development.
Skills: JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL
Experience: Built scalable web applications, implemented RESTful APIs, worked with microservices
Education: B.Sc. Computer Science
"@
    jobDescription = @"
Senior Full Stack Developer
Requirements: 5+ years experience, React, Node.js, TypeScript, PostgreSQL
Responsibilities: Develop and maintain web applications, design APIs, mentor junior developers
"@
} | ConvertTo-Json

try {
    Write-Host "      Analyzing resume against job description..." -ForegroundColor Gray
    $matchResponse = Invoke-WebRequest `
        -Uri "$baseUrl/ai/job-match" `
        -Method POST `
        -Body $resumeMatchData `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -UseBasicParsing `
        -TimeoutSec 60
    
    $matchResult = $matchResponse.Content | ConvertFrom-Json
    
    Write-Host "      ✅ Analysis complete" -ForegroundColor Green
    Write-Host "         Match Score: $($matchResult.data.matchScore)%" -ForegroundColor Cyan
    Write-Host "         Matched Skills: $($matchResult.data.matchedSkills.Count)" -ForegroundColor Green
    Write-Host "         Missing Skills: $($matchResult.data.missingSkills.Count)" -ForegroundColor Yellow
    
    Record-Test "Resume-Job Matching" "✅ PASS" "Match score: $($matchResult.data.matchScore)%"
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "         Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
    }
    Record-Test "Resume-Job Matching" "❌ FAIL" $_.Exception.Message
}

# Step 6: Test Resume Builder
Write-Host "`n[6/7] AI Feature #4: AI Resume Builder" -ForegroundColor Yellow
$resumeBuilderData = @{
    userProfile = @{
        name = "Jane Smith"
        currentRole = "Software Engineer"
        experience = "3 years in web development"
        skills = @("React", "Node.js", "Python", "AWS")
        education = "B.Sc. Computer Science"
        achievements = @(
            "Led team of 3 developers"
            "Reduced API response time by 40%"
        )
        projects = @(
            "E-commerce platform with 10k users"
        )
    }
    targetRole = "Senior Full Stack Engineer"
} | ConvertTo-Json -Depth 5

try {
    Write-Host "      Generating optimized resume..." -ForegroundColor Gray
    $resumeResponse = Invoke-WebRequest `
        -Uri "$baseUrl/ai/build-resume" `
        -Method POST `
        -Body $resumeBuilderData `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -UseBasicParsing `
        -TimeoutSec 60
    
    $resumeResult = $resumeResponse.Content | ConvertFrom-Json
    
    Write-Host "      ✅ Resume generated successfully" -ForegroundColor Green
    Write-Host "         Summary: $($resumeResult.data.summary.Substring(0, [Math]::Min(100, $resumeResult.data.summary.Length)))..." -ForegroundColor Cyan
    Write-Host "         Skills listed: $($resumeResult.data.skills.Count)" -ForegroundColor Gray
    
    Record-Test "AI Resume Builder" "✅ PASS" "Resume generated with $($resumeResult.data.skills.Count) skills"
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "         Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
    }
    Record-Test "AI Resume Builder" "❌ FAIL" $_.Exception.Message
}

# Step 7: Test Career Advice
Write-Host "`n[7/7] AI Feature #5: Personalized Career Advice" -ForegroundColor Yellow
$careerAdviceData = @{
    userProfile = @{
        currentRole = "Junior Developer"
        experience = "2 years"
        skills = @("JavaScript", "React", "HTML", "CSS")
        goals = "Become a Senior Full Stack Developer in 3 years"
    }
} | ConvertTo-Json -Depth 5

try {
    Write-Host "      Generating career advice..." -ForegroundColor Gray
    $adviceResponse = Invoke-WebRequest `
        -Uri "$baseUrl/ai/career-advice" `
        -Method POST `
        -Body $careerAdviceData `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -UseBasicParsing `
        -TimeoutSec 60
    
    $adviceResult = $adviceResponse.Content | ConvertFrom-Json
    
    Write-Host "      ✅ Career advice generated" -ForegroundColor Green
    Write-Host "         Suggested Roles: $($adviceResult.data.suggestedRoles.Count)" -ForegroundColor Cyan
    Write-Host "         Skills to Learn: $($adviceResult.data.skillsToLearn.Count)" -ForegroundColor Yellow
    Write-Host "         Action Items: $($adviceResult.data.nextSteps.Count)" -ForegroundColor Gray
    
    Record-Test "Career Advice" "✅ PASS" "Generated advice with $($adviceResult.data.suggestedRoles.Count) role suggestions"
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "         Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
    }
    Record-Test "Career Advice" "❌ FAIL" $_.Exception.Message
}

# Summary
Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    TEST SUMMARY                        " -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$testResults | ForEach-Object {
    $color = if($_.Status.StartsWith("✅")){'Green'}else{'Red'}
    Write-Host "$($_.Status) $($_.Test)" -ForegroundColor $color
    Write-Host "      $($_.Details)" -ForegroundColor Gray
}

$passedTests = ($testResults | Where-Object { $_.Status.StartsWith("✅") }).Count
$totalTests = $testResults.Count

Write-Host "`n═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " RESULT: $passedTests/$totalTests tests passed" -ForegroundColor $(if($passedTests -eq $totalTests){'Green'}else{'Yellow'})
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if($passedTests -eq $totalTests) {
    Write-Host "🎉 All AI features are working perfectly with Gemini API!" -ForegroundColor Green
    Write-Host "   API Key: AIzaSyDvHTtrbyewdriNAX4A9znfTR9dvc_o1MU" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some tests failed. Please check the details above." -ForegroundColor Yellow
}
