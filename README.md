# Job Search Platform with AI Mock Interviews

A comprehensive full-stack job search platform featuring AI-powered mock interviews, resume optimization, and intelligent job matching using Google Gemini AI.

## 🌟 Overview

This platform helps job seekers prepare for interviews with AI-powered mock interviews that provide detailed feedback, score evaluation, and personalized improvement suggestions. The system uses Google's Gemini 2.5 Flash model to generate dynamic interview questions and evaluate candidate responses with professional-grade feedback.

## ✨ Key Features

### 🎯 AI Mock Interview System
- **Dynamic Question Generation**: AI generates unique questions for each interview session
- **Multiple Interview Types**: Technical, HR, GDPI (Group Discussion & Personal Interview), Quantitative, and Verbal rounds
- **Intelligent Evaluation**: AI scores answers on a 0-10 scale with detailed feedback
- **Strict Scoring System**:
  - 0-2: Wrong, irrelevant, or "I don't know" answers
  - 3-4: Partially correct with major gaps
  - 5-6: Mediocre with some correct points
  - 7: Good answer covering most points
  - 8-10: Excellent answers (rare, only for truly outstanding responses)
- **Detailed Results Dashboard**:
  - Overall score percentage
  - Correct/incorrect answer tracking
  - Question-by-question breakdown
  - AI feedback with strengths and weaknesses
  - Missed points identification
  - Improved answer examples
  - Color-coded scoring (green for excellent, yellow for good, red for needs improvement)

### 🤖 Additional AI Features
- **Resume Matching**: Analyze resume against job descriptions
- **Resume Builder**: AI-powered resume optimization
- **Career Advice**: Personalized career guidance based on profile

### 👥 User Management
- **Dual User Types**: Job Seekers and Companies
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access**: Different features for different user types

### 💼 Job Management
- Job posting and browsing
- Application tracking
- Nearby jobs with location-based search
- Domain-specific job filtering

## 🛠 Technology Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt (10 salt rounds)
- **Validation**: class-validator with strict validation rules
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **API Documentation**: RESTful API design

### Frontend
- **Framework**: Next.js 16.1.1 with React
- **Build Tool**: Turbopack
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Communication**: Fetch API with JWT token authentication

### AI & Machine Learning
- **Model**: Google Gemini 2.5 Flash
- **Features**:
  - Natural language understanding
  - Context-aware question generation
  - Intelligent answer evaluation
  - Constructive feedback generation

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Projects/1
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create/edit .env file with the following:
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key-here

# Initialize database
npx prisma generate
npx prisma db push

# Seed database with demo data
npx ts-node prisma/seed.ts

# Start backend server
npm run start:dev
```

Backend will run on: **http://localhost:3001**

### 3. Frontend Setup

```bash
cd ../job-search-web

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 🔑 Demo Credentials

### Job Seeker Account
- **Email**: john.doe@example.com
- **Password**: Password123!

### Company Account
- **Email**: hr@techcorp.com
- **Password**: Password123!

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Job Seeker Registration
```http
POST /api/auth/job-seeker/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phone": "+1234567890"
}
```

#### Job Seeker Login
```http
POST /api/auth/job-seeker/login
Content-Type: application/json

{
  "emailOrPhone": "john.doe@example.com",
  "password": "Password123!"
}

Response:
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "JOB_SEEKER"
  }
}
```

### AI Mock Interview Endpoints

#### Generate Interview Questions
```http
POST /api/ai/mock-interview
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "jobRole": "Software Engineer",
  "experienceLevel": "mid-level",
  "numberOfQuestions": 5
}

Response:
{
  "success": true,
  "data": {
    "jobRole": "Software Engineer",
    "experienceLevel": "mid-level",
    "questions": [
      {
        "id": 1,
        "question": "Describe your experience with RESTful API design...",
        "type": "technical",
        "difficulty": "medium",
        "expectedAnswer": "Should mention HTTP methods, status codes..."
      }
    ]
  }
}
```

#### Evaluate Interview Answers
```http
POST /api/ai/evaluate-interview
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "questions": [
    {
      "id": 1,
      "question": "What is React?",
      "type": "technical",
      "difficulty": "easy",
      "expectedAnswer": "A JavaScript library for building UIs"
    }
  ],
  "answers": [
    "React is a JavaScript library for building user interfaces..."
  ],
  "role": "Software Engineer"
}

Response:
{
  "success": true,
  "data": {
    "overallScore": 85,
    "averageScore": 8.5,
    "correctAnswers": 1,
    "totalQuestions": 1,
    "evaluations": [
      {
        "questionId": 1,
        "question": "What is React?",
        "answer": "React is a JavaScript library...",
        "evaluation": {
          "score": 8.5,
          "strengths": ["Clear definition", "Mentioned key purpose"],
          "weaknesses": ["Could elaborate on component-based architecture"],
          "missedPoints": ["Virtual DOM", "Declarative approach"],
          "improvedAnswer": "React is a declarative JavaScript library...",
          "feedback": "Good understanding of basics, add more technical depth"
        },
        "isCorrect": true
      }
    ]
  }
}
```

### Other AI Endpoints

#### Job Resume Matching
```http
POST /api/ai/job-match
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "resumeText": "Software Engineer with 5 years experience...",
  "jobDescription": "Looking for Senior Developer..."
}
```

#### Resume Builder
```http
POST /api/ai/build-resume
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userProfile": {
    "name": "John Doe",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": "5 years"
  },
  "targetRole": "Senior Software Engineer"
}
```

#### Career Advice
```http
POST /api/ai/career-advice
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userProfile": {
    "currentRole": "Software Engineer",
    "experience": "3 years",
    "skills": ["React", "Node.js"],
    "goals": "Become a Senior Developer"
  }
}
```

## 🎯 How to Use the Mock Interview Feature

### Step-by-Step Guide

1. **Login**
   - Navigate to http://localhost:3000/auth
   - Login with: john.doe@example.com / Password123!

2. **Access Dashboard**
   - After login, you'll be redirected to the job seeker dashboard

3. **Start Mock Interview**
   - Scroll to the "Mock Interview Rounds" section
   - Click "Start Interview" on any interview type:
     - 💻 Technical Round
     - 👥 HR Round
     - 🎯 GDPI Round
     - 📊 Quantitative Round
     - 💬 Verbal Round

4. **Answer Questions**
   - AI generates 5 unique questions for each session
   - Type your answer in the text area
   - Click "Next Question" to proceed
   - Questions are different every time you take the interview

5. **Submit Interview**
   - After answering all questions, click "Submit Interview"
   - Wait for AI evaluation (may take 10-30 seconds)

6. **View Results**
   - See your overall score percentage
   - Check correct/incorrect answer count
   - Review question-by-question breakdown:
     - ✅ Green badge = Correct (score ≥ 8/10)
     - ❌ Red badge = Needs Work (score < 8/10)
   - Read AI feedback for each answer
   - Review strengths, weaknesses, and missed points
   - Learn from improved answer examples

7. **Retry**
   - Click "Try Another Round" to practice more
   - New questions will be generated each time

## 🐛 Recent Bug Fixes

### Issue #1: Wrong Answers Marked as Correct
**Problem**: Users giving all wrong answers were seeing 4/5 correct answers.

**Root Causes**:
- AI was giving scores of 6-7/10 even for poor answers
- Threshold of ≥7 (70%) was too lenient
- Fallback code generated random high scores on API failures

**Solutions Implemented**:
1. **Stricter AI Evaluation**: Added explicit scoring guidelines to AI prompt
2. **Higher Threshold**: Changed from ≥7 to ≥8 (80% required for "correct")
3. **Removed Fake Scores**: Deleted random score fallback, now shows actual errors

### Issue #2: Validation Errors
**Problem**: Backend rejecting questions with "property type should not exist" errors.

**Solution**: Added optional `type` and `difficulty` properties to `QuestionDto` validation schema.

### Issue #3: Authentication Issues
**Problem**: Users couldn't login with Password123!

**Solution**: Updated database seed script and reseeded with correct password hash.

## 🧪 Testing

### Test Mock Interview Flow

1. **Start Backend**:
```bash
cd backend
npm run start:dev
```

2. **Start Frontend**:
```bash
cd job-search-web
npm run dev
```

3. **Test with Wrong Answers**:
   - Login to the platform
   - Start any mock interview
   - Intentionally give wrong answers like "I don't know"
   - Submit the interview
   - **Expected Result**:
     - Low scores (0-4/10)
     - isCorrect = false
     - Red badges
     - Overall score < 40%
     - 0 correct answers

4. **Test with Good Answers**:
   - Start another interview
   - Give detailed, accurate answers
   - **Expected Result**:
     - High scores (7-10/10)
     - isCorrect = true for scores ≥8
     - Green badges
     - Overall score > 70%

### API Testing with PowerShell

```powershell
# Test login
$loginData = @{ 
  emailOrPhone = "john.doe@example.com"
  password = "Password123!" 
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/job-seeker/login" `
  -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing

$token = ($response.Content | ConvertFrom-Json).access_token

# Test mock interview generation
$mockData = @{ 
  jobRole = "Software Engineer"
  experienceLevel = "mid-level"
  numberOfQuestions = 5 
} | ConvertTo-Json

$questions = Invoke-WebRequest -Uri "http://localhost:3001/api/ai/mock-interview" `
  -Method POST -Body $mockData -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing
```

## 📂 Project Structure

```
Projects/1/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── jobs/              # Jobs management
│   │   ├── applications/      # Application tracking
│   │   ├── gemini/            # AI integration
│   │   │   ├── gemini.client.ts      # Gemini AI client
│   │   │   ├── gemini.service.ts     # AI services
│   │   │   └── gemini.controller.ts  # AI endpoints
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   ├── .env                   # Environment variables
│   └── package.json
│
├── job-search-web/            # Next.js frontend
│   ├── app/
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   │   └── job-seeker/    # Job seeker dashboard
│   │   │       └── page.tsx   # Main dashboard with mock interview
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── public/                # Static assets
│   └── package.json
│
└── README.md                  # This file
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Environment Variables**: Sensitive data stored in .env
- **CORS Protection**: Configured for localhost:3000
- **Input Validation**: class-validator with strict rules
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 🎨 UI Features

- **Responsive Design**: Works on all screen sizes
- **Dark Theme**: Modern dark UI with gradient accents
- **Real-time Feedback**: Instant visual feedback for actions
- **Toast Notifications**: Non-intrusive success/error messages
- **Loading States**: Clear loading indicators during AI processing
- **Color-Coded Results**: Visual distinction between correct/incorrect answers
- **Progress Tracking**: Current question number displayed
- **Modal Dialogs**: Clean modal interfaces for results

## ⚙️ Configuration

### Backend Environment Variables (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key-here
```

### Validation Rules
- Email: Must be valid email format
- Password: Minimum 6 characters
- Phone: Optional, valid phone format
- JWT Token: Required for all protected routes
- Request Body: Strict validation with class-validator

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID <process-id> /F

# Restart backend
cd backend
npm run start:dev
```

### Frontend Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <process-id> /F

# Restart frontend
cd job-search-web
npm run dev
```

### AI Not Responding
- Verify GEMINI_API_KEY is set correctly in backend/.env
- Check API key is valid and has not expired
- Ensure backend can access internet (no firewall blocking)
- Check backend console logs for error messages

### Database Issues
```bash
# Reset database
cd backend
npx prisma db push --force-reset

# Reseed database
npx ts-node prisma/seed.ts
```

### Login Not Working
- Ensure you're using Password123! (with capital P and !)
- Check backend is running on port 3001
- Open browser DevTools Console (F12) to see error messages
- Verify JWT token is being stored in localStorage

## 📊 Performance Considerations

- **AI Response Time**: 5-30 seconds depending on question complexity
- **Question Generation**: ~10 seconds for 5 questions
- **Answer Evaluation**: ~5 seconds per answer (25 seconds for 5 answers)
- **Database Queries**: <100ms for most operations
- **Frontend Load Time**: <2 seconds initial load

## 🔄 Future Enhancements

- [ ] Add voice-to-text for answer input
- [ ] Implement video interview simulation
- [ ] Add interview analytics and progress tracking
- [ ] Support for multiple languages
- [ ] Company-specific interview preparation
- [ ] Interview scheduling with calendar integration
- [ ] Peer practice sessions
- [ ] Export interview results as PDF
- [ ] Email notifications for interview reminders
- [ ] Mobile app version

## 📝 Database Schema

### Users Table
- id (UUID)
- name (String)
- email (String, unique)
- password (String, hashed)
- phone (String, optional)
- role (JOB_SEEKER | COMPANY)
- createdAt (DateTime)
- updatedAt (DateTime)

### Jobs Table
- id (UUID)
- title (String)
- description (String)
- company (Relation)
- location (String)
- salary (String)
- type (FULL_TIME | PART_TIME | CONTRACT)
- domain (String)
- createdAt (DateTime)

### Applications Table
- id (UUID)
- jobSeeker (Relation)
- job (Relation)
- status (PENDING | ACCEPTED | REJECTED)
- appliedAt (DateTime)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

## 👨‍💻 Support

For issues or questions:
- Check the Troubleshooting section
- Review the API Documentation
- Open browser DevTools Console for frontend errors
- Check backend terminal logs for backend errors

## 🎓 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [JWT Authentication](https://jwt.io/introduction)

---

**Built with ❤️ using NestJS, Next.js, and Google Gemini AI**

**Last Updated**: January 14, 2026
