# 🚀 Hyper-Local Job Search Platform - Project Status

## ✅ All Systems Operational

### 📊 Service Status

| Service | Status | URL | Description |
|---------|--------|-----|-------------|
| **Frontend** | 🟢 RUNNING | http://localhost:3000 | Next.js 16.1.1 with React & Tailwind CSS |
| **Backend** | 🟢 RUNNING | http://localhost:3001/api | NestJS with TypeScript & Prisma ORM |
| **AI Service** | 🟢 RUNNING | http://localhost:8000 | FastAPI with Python 3.14 & NLP |
| **Database** | 🟢 READY | SQLite (dev.db - 148 KB) | Sample data loaded |

---

## 🗄️ Database Information

**Database Type:** SQLite (development)  
**Location:** `backend/prisma/dev.db`  
**Size:** 148 KB  
**Schema Status:** ✅ Migrated and seeded

### Sample Data Loaded:
- **2 Job Seekers**
  - john.doe@example.com (Password: Password123!)
  - jane.smith@example.com (Password: Password123!)
- **2 Companies**
  - TechCorp Solutions (admin@techcorp.com)
  - DataCorp Inc (admin@datacorp.com)
- **3 Job Postings**
  - Senior Software Engineer @ TechCorp
  - Data Scientist @ TechCorp
  - Full Stack Developer @ DataCorp
- **2 Applications** with AI match scores

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16.1.1 (App Router)
- **UI:** React 19, Tailwind CSS
- **Validation:** React Hook Form, Zod
- **HTTP Client:** Axios
- **Features:** SSR, Hot Reload, Responsive Design

### Backend
- **Framework:** NestJS (TypeScript)
- **ORM:** Prisma 6.19.2
- **Database:** SQLite (dev), PostgreSQL-ready (prod)
- **Authentication:** JWT + bcrypt
- **Validation:** class-validator, class-transformer
- **Modules:** Auth, Jobs, Applications, Prisma

### AI Microservice
- **Framework:** FastAPI (Python 3.14)
- **Server:** Uvicorn (ASGI)
- **NLP:** Regex-based pattern matching
- **Features:** Resume parsing, Job matching, Skill extraction
- **Algorithm:** Weighted scoring (60% skills, 20% experience, 20% keywords)

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST /api/auth/job-seeker/signup    - Register new job seeker
POST /api/auth/job-seeker/login     - Job seeker login
POST /api/auth/company/signup       - Register new company
POST /api/auth/company/login        - Company login
```

### Jobs (`/api/jobs`)
```
POST /api/jobs                       - Create new job posting
GET  /api/jobs/nearby                - Geo-based job search
     ?latitude=<lat>
     &longitude=<lng>
     &radius=<km>                    - Search radius (default: 10km)
     &domain=<domain>                - Filter by domain
     &page=<n>                       - Pagination
     &limit=<n>                      - Results per page
GET  /api/jobs/domains               - List all job domains
GET  /api/jobs/:id                   - Get job details
```

### Applications (`/api/applications`)
```
POST /api/applications               - Apply for a job
GET  /api/applications/my            - Get user's applications
GET  /api/applications/stats         - Application statistics
GET  /api/applications/job/:jobId    - Applications for specific job
GET  /api/applications/:id           - Get application details
PUT  /api/applications/:id/status    - Update application status
```

### AI Service (Port 8000)
```
POST /parse-resume                   - Parse resume and extract details
     Body: { resume_text: string }
     
POST /match                          - Match resume with job description
     Body: {
       resume_text: string,
       job_title: string,
       job_description: string,
       required_skills: string[]
     }
```

---

## 🎯 Key Features Implemented

### ✅ Completed
1. **User Authentication System**
   - Separate flows for job seekers and companies
   - JWT-based authentication
   - Password hashing with bcrypt

2. **Geo-Location Job Search**
   - Haversine formula for distance calculation
   - Radius-based search (customizable km)
   - Location coordinates (latitude/longitude)

3. **Job Application Tracking**
   - Status workflow: pending → reviewing → interview → rejected/accepted
   - Application statistics
   - Duplicate application prevention

4. **AI Resume Matching**
   - Resume parsing (skills, experience, education extraction)
   - Job-resume matching with weighted scoring
   - 200+ tech skills database
   - Match suggestions and improvement tips

5. **Database Layer**
   - Prisma ORM with type-safe queries
   - SQLite for development
   - PostgreSQL-ready for production
   - Seed data for testing

---

## 🧪 Testing the Application

### 1. Test Frontend
```
Open: http://localhost:3000
```

### 2. Test Backend API
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:3001/api" -UseBasicParsing

# Sign up as job seeker
$body = @{
  name = "Test User"
  email = "test@example.com"
  phone = "+1234567890"
  password = "Password123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/auth/job-seeker/signup" `
  -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### 3. Test AI Service
```powershell
# Parse resume
$resume = @{
  resume_text = "Software Engineer with 5 years experience in Python, JavaScript, React, Node.js. Bachelor's degree in Computer Science."
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/parse-resume" `
  -Method POST -Body $resume -ContentType "application/json" -UseBasicParsing

# Match resume with job
$match = @{
  resume_text = "Python developer with 3 years experience"
  job_title = "Senior Python Developer"
  job_description = "Looking for experienced Python developer"
  required_skills = @("Python", "Django", "PostgreSQL")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/match" `
  -Method POST -Body $match -ContentType "application/json" -UseBasicParsing
```

---

## 🚀 Next Development Steps

### Phase 1: Integration
- [ ] Connect backend to AI service for automatic match scoring
- [ ] Add resume upload functionality to frontend
- [ ] Implement real-time notifications

### Phase 2: Enhancement
- [ ] Add PDF/DOCX resume parsing (PyPDF2, python-docx)
- [ ] Upgrade to spaCy or NLTK for advanced NLP
- [ ] Implement BERT-based semantic matching
- [ ] Add email notification service

### Phase 3: Production
- [ ] Switch to PostgreSQL database
- [ ] Implement Redis caching
- [ ] Add Docker containerization
- [ ] Setup CI/CD pipeline
- [ ] Deploy to cloud (AWS/Azure/GCP)

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

---

## 🔧 Running the Services

### Start All Services:
```powershell
# Terminal 1: Backend
cd d:\Projects\1\backend
npm run start:dev

# Terminal 2: Frontend
cd d:\Projects\1\job-search-web
npm run dev

# Terminal 3: AI Service
cd d:\Projects\1\ai-resume-matcher
.\venv\Scripts\python.exe main.py
```

### Stop Services:
Press `Ctrl+C` in each terminal

---

## 📊 Project Structure

```
d:\Projects\1\
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── jobs/              # Jobs module
│   │   ├── applications/      # Applications module
│   │   └── prisma/            # Prisma service
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       ├── migrations/        # Database migrations
│       └── dev.db            # SQLite database
│
├── job-search-web/            # Next.js Frontend
│   ├── app/
│   │   ├── auth/             # Auth pages
│   │   ├── dashboard/        # Dashboard pages
│   │   └── layout.tsx        # Root layout
│   └── public/
│
└── ai-resume-matcher/         # FastAPI AI Service
    ├── main.py               # FastAPI application
    ├── venv/                 # Python virtual environment
    ├── requirements.txt      # Python dependencies
    ├── README.md            # AI service documentation
    └── DOCUMENTATION.md     # Technical documentation
```

---

## 📚 Documentation

- **Backend API:** Auto-generated Swagger docs at `/api/docs` (add Swagger module)
- **AI Service:** OpenAPI docs at http://localhost:8000/docs
- **Frontend:** Component library and usage guide in README.md

---

## ✨ Contributors

Built with ❤️ using:
- Next.js Team
- NestJS Team
- FastAPI Team
- Prisma Team

---

**Status:** ✅ All services operational  
**Last Updated:** January 13, 2026  
**Version:** 1.0.0 (Development)
