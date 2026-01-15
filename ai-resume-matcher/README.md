# AI Resume Matching Service

## Overview
AI-powered resume parsing and job matching service built with FastAPI and NLP techniques.

## Features

### Resume Parsing
- Extract technical skills (200+ recognized skills)
- Identify years of experience
- Parse education qualifications
- Extract contact information (email, phone)
- Generate keyword analysis

### Job Matching
- Calculate match score (0-100)
- Compare resume skills with job requirements
- Identify matched and missing skills
- Verify experience level requirements
- Keyword overlap analysis

### Intelligent Suggestions
- Highlight missing critical skills
- Recommend resume improvements
- Identify candidate strengths
- Provide actionable feedback

## Installation

### 1. Create Virtual Environment
```bash
cd d:/Projects/1/ai-resume-matcher
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

## Running the Service

### Development Mode
```bash
python main.py
```
or
```bash
uvicorn main:app --reload --port 8000
```

Service will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### POST /parse-resume
Parse resume and extract structured information.

**Request:**
```json
{
  "resume_text": "John Doe\n5 years experience with Python, React, PostgreSQL..."
}
```

**Response:**
```json
{
  "skills": ["Python", "React", "PostgreSQL"],
  "experience_years": 5,
  "education": ["Bachelor of Science in Computer Science"],
  "keywords": ["experience", "python", "react", "postgresql"],
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### POST /match
Calculate match score between resume and job description.

**Request:**
```json
{
  "resume_text": "Senior Developer with 5 years Python, React, Node.js...",
  "job_description": "Looking for Python developer with FastAPI, PostgreSQL...",
  "job_title": "Senior Backend Developer",
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
    {
      "skill": "Python",
      "found": true,
      "importance": "critical"
    },
    {
      "skill": "FastAPI",
      "found": false,
      "importance": "critical"
    }
  ],
  "experience_match": true,
  "keyword_matches": 12,
  "suggestions": [
    "Add these missing skills: FastAPI",
    "Highlight your Python experience more prominently"
  ],
  "strengths": [
    "Strong skill match: 8 relevant skills found",
    "Experience level meets or exceeds requirements"
  ]
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-resume-matcher"
}
```

## Technology Stack

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation using Python type annotations

### NLP Techniques
- **Regex Pattern Matching**: Extract structured data (email, phone, experience)
- **Keyword Extraction**: TF-IDF inspired approach for important terms
- **Skill Database**: 200+ predefined technical skills across categories:
  - Programming languages (16+)
  - Frameworks (14+)
  - Databases (10+)
  - Cloud & DevOps (9+)
  - Data Science (11+)
  - Other technical skills (11+)

### Matching Algorithm
1. **Skill Matching (60% weight)**
   - Compare resume skills with job requirements
   - Identify matched and missing skills
   
2. **Experience Matching (20% weight)**
   - Parse years of experience from both resume and job
   - Verify candidate meets minimum requirements
   
3. **Keyword Overlap (20% weight)**
   - Extract top keywords from both documents
   - Calculate intersection score

**Final Score:** Weighted sum clamped to 0-100 range

## Skill Categories

```python
TECH_SKILLS = {
    'programming_languages': [
        'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'ruby', 
        'go', 'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'sql'
    ],
    'frameworks': [
        'react', 'angular', 'vue', 'nextjs', 'django', 'flask', 'fastapi',
        'spring', 'express', 'nodejs', 'rails', 'laravel', '.net'
    ],
    'databases': [
        'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'
    ],
    'cloud': [
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'
    ],
    'data_science': [
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'
    ]
}
```

## Integration with Backend

### From NestJS Backend:
```typescript
// Call AI matching service
const response = await axios.post('http://localhost:8000/match', {
  resume_text: application.resumeText,
  job_description: job.description,
  job_title: job.title,
  required_skills: job.requirements
});

const matchScore = response.data.match_score;
```

### Environment Configuration:
Add to backend `.env`:
```env
AI_MATCHER_URL=http://localhost:8000
```

## Testing

### Using cURL:
```bash
# Parse resume
curl -X POST "http://localhost:8000/parse-resume" \
  -H "Content-Type: application/json" \
  -d '{"resume_text":"Senior Python Developer with 5 years experience..."}'

# Match resume to job
curl -X POST "http://localhost:8000/match" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Python developer with Django, PostgreSQL...",
    "job_description": "Looking for Python developer...",
    "job_title": "Backend Developer",
    "required_skills": ["Python", "Django", "PostgreSQL"]
  }'
```

### Using Python:
```python
import requests

# Parse resume
response = requests.post('http://localhost:8000/parse-resume', json={
    'resume_text': 'Your resume text here...'
})
print(response.json())

# Match resume
response = requests.post('http://localhost:8000/match', json={
    'resume_text': 'Resume text...',
    'job_description': 'Job description...',
    'job_title': 'Software Engineer',
    'required_skills': ['Python', 'React']
})
print(f"Match Score: {response.json()['match_score']}%")
```

## Architecture

```
ai-resume-matcher/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── venv/               # Virtual environment (created after setup)
```

## Production Considerations

1. **Enhanced NLP**: Integrate spaCy or NLTK for better text processing
2. **ML Models**: Train custom models for skill extraction and matching
3. **Database**: Cache parsed resumes and matching results
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **Authentication**: Integrate with backend JWT authentication
6. **Logging**: Add structured logging with rotation
7. **Monitoring**: Set up health checks and metrics (Prometheus)
8. **Containerization**: Create Dockerfile for deployment
9. **Advanced Features**:
   - Resume scoring/ranking
   - Semantic similarity using embeddings
   - Multi-language support
   - PDF/DOCX parsing

## Future Enhancements

- [ ] PDF and DOCX file upload support
- [ ] Advanced NLP with spaCy/transformers
- [ ] Machine learning models for skill extraction
- [ ] Semantic matching using embeddings (BERT, Sentence Transformers)
- [ ] Resume quality scoring
- [ ] Bias detection and mitigation
- [ ] Multi-language support
- [ ] Resume optimization suggestions
- [ ] Industry-specific skill databases
- [ ] Integration with ATS systems

## License
Proprietary - Part of Job Search Platform
