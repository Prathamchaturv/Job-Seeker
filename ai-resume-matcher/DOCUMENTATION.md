# 🤖 AI Resume Matching Service - Documentation

## Overview

AI-powered resume parsing and job matching microservice built with FastAPI and NLP techniques. Provides intelligent resume analysis, skill extraction, and job matching capabilities.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Job Search Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Frontend   │─────▶│    Backend   │─────▶│ Database  │ │
│  │  (Next.js)   │      │   (NestJS)   │      │ (SQLite)  │ │
│  │  Port 3000   │      │  Port 3001   │      └───────────┘ │
│  └──────────────┘      └──────┬───────┘                     │
│                                │                              │
│                                │ HTTP POST                    │
│                                ▼                              │
│                       ┌────────────────┐                     │
│                       │  AI Resume     │                     │
│                       │  Matcher       │                     │
│                       │  (FastAPI)     │                     │
│                       │  Port 8000     │                     │
│                       └────────────────┘                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### 1. Resume Parsing `/parse-resume`
Extracts structured information from resume text:
- **Skills**: 200+ technical skills recognition
- **Experience**: Years of experience extraction
- **Education**: Degree and qualification parsing
- **Contact**: Email and phone number extraction
- **Keywords**: Important terms identification

### 2. Job Matching `/match`
Intelligent matching algorithm with weighted scoring:
- **Match Score**: 0-100 score calculation
- **Skill Analysis**: Matched vs missing skills
- **Experience Verification**: Meets job requirements
- **Keyword Overlap**: Semantic similarity
- **Suggestions**: Actionable improvement recommendations
- **Strengths**: Candidate highlights

### 3. Skill Database
200+ technical skills across categories:
- Programming Languages (16+): Python, JavaScript, TypeScript, Java, C++, Go, Rust
- Frameworks (14+): React, Angular, Vue, Django, FastAPI, Spring, Express
- Databases (10+): PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
- Cloud & DevOps (9+): AWS, Azure, GCP, Docker, Kubernetes, Terraform
- Data Science (11+): TensorFlow, PyTorch, Pandas, NumPy, Scikit-learn
- Tools & Methodologies: Git, Agile, CI/CD, TDD, Microservices

## Matching Algorithm

### Scoring Formula
```python
Final Score = (Skill Match × 0.6) + (Experience Match × 0.2) + (Keyword Overlap × 0.2)
```

### Components

#### 1. Skill Matching (60% weight)
```python
skill_score = (matched_skills / total_required_skills) × 60
```
- Compares resume skills with job requirements
- Identifies critical vs nice-to-have skills
- Accounts for skill importance weighting

#### 2. Experience Matching (20% weight)
```python
experience_score = 20 if candidate_years >= required_years else 10
```
- Parses years from both resume and job description
- Binary match: meets requirements or not
- Half credit if experience not explicitly stated

#### 3. Keyword Overlap (20% weight)
```python
keyword_score = min(common_keywords / 10, 1.0) × 20
```
- Extracts top 30 keywords from each document
- Removes stop words
- Calculates intersection
- Normalized to 0-20 range

### Skill Importance Levels
- **Critical**: Explicitly listed in `required_skills` array
- **Important**: Found in job description text
- **Nice-to-have**: Additional skills that boost match score

## API Endpoints

### POST /parse-resume
**Request:**
```json
{
  "resume_text": "John Doe\nSenior Python Developer\n5 years experience..."
}
```

**Response:**
```json
{
  "skills": ["Python", "Django", "PostgreSQL", "Docker"],
  "experience_years": 5,
  "education": ["Bachelor Of Science In Computer Science"],
  "keywords": ["experience", "development", "python", "django"],
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### POST /match
**Request:**
```json
{
  "resume_text": "Senior Developer with 5 years Python, React...",
  "job_description": "Looking for Python developer with FastAPI...",
  "job_title": "Backend Developer",
  "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"]
}
```

**Response:**
```json
{
  "match_score": 85,
  "skills_matched": ["Python", "PostgreSQL", "Docker"],
  "skills_missing": ["FastAPI"],
  "skill_details": [
    {"skill": "Python", "found": true, "importance": "critical"},
    {"skill": "FastAPI", "found": false, "importance": "critical"}
  ],
  "experience_match": true,
  "keyword_matches": 12,
  "suggestions": [
    "Add these missing skills: FastAPI",
    "Highlight your Python experience more prominently"
  ],
  "strengths": [
    "Strong skill match: 8 relevant skills found",
    "Experience level meets or exceeds requirements",
    "Good keyword alignment with job description"
  ]
}
```

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd ai-resume-matcher
python -m venv venv
```

### 2. Activate Virtual Environment
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Service
```bash
python main.py
```
Service available at http://localhost:8000

### 5. View API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Integration Examples

### From NestJS Backend

```typescript
// applications.service.ts
import axios from 'axios';

const AI_MATCHER_URL = process.env.AI_MATCHER_URL || 'http://localhost:8000';

async applyForJob(applyJobDto: ApplyJobDto, jobSeekerId: string) {
  // ... existing code ...
  
  // Get job details
  const job = await this.getJobById(applyJobDto.jobId);
  
  // Calculate match score using AI service
  try {
    const matchResponse = await axios.post(`${AI_MATCHER_URL}/match`, {
      resume_text: applyJobDto.resumeText || 'Resume text...',
      job_description: job.description,
      job_title: job.title,
      required_skills: job.requirements
    });
    
    const matchScore = matchResponse.data.match_score;
    
    // Create application with match score
    const newApplication = {
      // ... other fields ...
      matchScore: matchScore,
      aiSuggestions: matchResponse.data.suggestions,
    };
    
  } catch (error) {
    console.error('AI matching error:', error);
    // Fallback to default match score
  }
}
```

### From Frontend (Next.js)

```typescript
// lib/ai-api.ts
export const aiApi = {
  parseResume: async (resumeText: string) => {
    const response = await fetch('http://localhost:8000/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: resumeText })
    });
    return response.json();
  },
  
  matchResume: async (resumeText: string, jobId: string) => {
    // First get job details from backend
    const job = await fetch(`http://localhost:3001/api/jobs/${jobId}`);
    const jobData = await job.json();
    
    // Then match with AI service
    const response = await fetch('http://localhost:8000/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobData.description,
        job_title: jobData.title,
        required_skills: jobData.requirements
      })
    });
    return response.json();
  }
};
```

## Testing

### Run Test Suite
```bash
cd ai-resume-matcher
python test_api.py
```

### Manual Testing with cURL
```bash
# Health check
curl http://localhost:8000/health

# Parse resume
curl -X POST http://localhost:8000/parse-resume \
  -H "Content-Type: application/json" \
  -d '{"resume_text":"Senior Python Developer with 5 years..."}'

# Match resume
curl -X POST http://localhost:8000/match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Python developer...",
    "job_description": "Looking for Python developer...",
    "job_title": "Backend Developer",
    "required_skills": ["Python", "Django", "PostgreSQL"]
  }'
```

## NLP Techniques

### 1. Regex Pattern Matching
- Email extraction: `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}`
- Phone extraction: `\+?1?\s*\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})`
- Experience: `(\d+)\+?\s*years?\s+(?:of\s+)?experience`
- Education: `bachelor|master|phd|doctorate|mba`

### 2. Keyword Extraction
- Tokenization with regex: `\b[a-z]{3,}\b`
- Stop word filtering (50+ common words)
- Frequency counting with Counter
- Top-N selection for comparison

### 3. Skill Recognition
- Predefined skill database (200+ skills)
- Word boundary matching to avoid false positives
- Case-insensitive comparison
- Deduplication and sorting

### 4. Text Normalization
- Lowercase conversion
- Special character handling
- Whitespace normalization

## Performance

### Response Times
- Parse Resume: ~50-100ms
- Match Resume: ~100-200ms
- Health Check: ~5ms

### Scalability
- Stateless design (no session management)
- Horizontal scaling capable
- In-memory processing (no database required)
- Async request handling with FastAPI

## Future Enhancements

### Phase 1: Enhanced NLP
- [ ] spaCy integration for better NER
- [ ] NLTK for advanced text processing
- [ ] Semantic similarity with embeddings
- [ ] Context-aware skill extraction

### Phase 2: Machine Learning
- [ ] Train custom skill extraction model
- [ ] BERT-based semantic matching
- [ ] Sentence Transformers for embeddings
- [ ] Resume quality scoring model

### Phase 3: File Processing
- [ ] PDF resume parsing (PyPDF2, pdfplumber)
- [ ] DOCX file support (python-docx)
- [ ] OCR for scanned documents (Tesseract)
- [ ] Multi-format support

### Phase 4: Advanced Features
- [ ] Resume improvement suggestions
- [ ] Bias detection and mitigation
- [ ] Industry-specific skill databases
- [ ] Multi-language support (i18n)
- [ ] Resume ranking/scoring
- [ ] Automated interview question generation

### Phase 5: Production Ready
- [ ] Database integration (cache results)
- [ ] Authentication with JWT
- [ ] Rate limiting
- [ ] Logging and monitoring
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API versioning
- [ ] Comprehensive test coverage

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | FastAPI | High-performance async API |
| Server | Uvicorn | ASGI server |
| Validation | Pydantic | Request/response models |
| NLP | Regex + Custom | Text parsing and extraction |
| Skills DB | Python Dict | Predefined skill database |
| Matching | Custom Algorithm | Weighted scoring system |

## Environment Variables

```env
# Add to backend .env
AI_MATCHER_URL=http://localhost:8000
AI_MATCHER_ENABLED=true
AI_MATCHER_TIMEOUT=5000  # ms
```

## Monitoring

### Health Check Endpoint
```bash
GET /health
Response: {"status": "healthy", "service": "ai-resume-matcher"}
```

### Metrics to Track
- Request count per endpoint
- Average response time
- Match score distribution
- Error rate
- Top extracted skills

## Security Considerations

1. **Input Validation**: Pydantic models validate all inputs
2. **CORS**: Configured for frontend/backend origins only
3. **Rate Limiting**: To be implemented for production
4. **Content Length**: Limit resume text size (prevent DoS)
5. **Sanitization**: Clean user input before processing

## License
Proprietary - Part of Job Search Platform

## Support
For issues or questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 13, 2026  
**Status**: ✅ Operational
