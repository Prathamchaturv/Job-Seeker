"""
AI Resume Matching Service.

Responsibilities:
- Parse resume text
- Extract skills
- Compare resume with job description
- Generate match score (0–100)
- Provide improvement suggestions

Tech:
- FastAPI
- NLP techniques
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import re
from collections import Counter
import math

app = FastAPI(
    title="AI Resume Matching Service",
    description="Resume parsing and job matching with NLP",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ResumeParseRequest(BaseModel):
    resume_text: str = Field(..., description="Resume content as text")

class JobMatchRequest(BaseModel):
    resume_text: str = Field(..., description="Resume content as text")
    job_description: str = Field(..., description="Job description")
    job_title: str = Field(..., description="Job title")
    required_skills: List[str] = Field(default=[], description="Required skills for the job")

class SkillMatch(BaseModel):
    skill: str
    found: bool
    importance: str  # 'critical', 'important', 'nice-to-have'

class MatchResult(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="Overall match score")
    skills_matched: List[str]
    skills_missing: List[str]
    skill_details: List[SkillMatch]
    experience_match: bool
    keyword_matches: int
    suggestions: List[str]
    strengths: List[str]

class ParsedResume(BaseModel):
    skills: List[str]
    experience_years: Optional[int]
    education: List[str]
    keywords: List[str]
    email: Optional[str]
    phone: Optional[str]

# Common tech skills database
TECH_SKILLS = {
    'programming_languages': [
        'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'ruby', 'go',
        'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'sql'
    ],
    'frameworks': [
        'react', 'angular', 'vue', 'nextjs', 'django', 'flask', 'fastapi',
        'spring', 'express', 'nodejs', 'rails', 'laravel', '.net', 'flutter'
    ],
    'databases': [
        'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
        'dynamodb', 'oracle', 'sqlite', 'mariadb'
    ],
    'cloud': [
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
        'github actions', 'gitlab ci', 'circleci'
    ],
    'data_science': [
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
        'keras', 'spark', 'hadoop', 'tableau', 'power bi'
    ],
    'other': [
        'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
        'ci/cd', 'tdd', 'design patterns', 'oop', 'functional programming'
    ]
}

ALL_SKILLS = []
for category in TECH_SKILLS.values():
    ALL_SKILLS.extend(category)

def extract_skills(text: str) -> List[str]:
    """Extract technical skills from text using keyword matching."""
    text_lower = text.lower()
    found_skills = []
    
    # Check for each known skill
    for skill in ALL_SKILLS:
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill.title())
    
    # Remove duplicates and sort
    return sorted(list(set(found_skills)))

def extract_experience_years(text: str) -> Optional[int]:
    """Extract years of experience from resume text."""
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s+in\s+(?:software|development|programming)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return None

def extract_education(text: str) -> List[str]:
    """Extract education qualifications from resume."""
    education_keywords = [
        r'bachelor(?:\'s)?\s+(?:of\s+)?(?:science|arts|engineering)?',
        r'master(?:\'s)?\s+(?:of\s+)?(?:science|arts|engineering)?',
        r'phd|doctorate|doctoral',
        r'mba|master\s+of\s+business\s+administration',
        r'b\.?s\.?|m\.?s\.?|b\.?sc\.?|m\.?sc\.?',
    ]
    
    found_education = []
    text_lower = text.lower()
    
    for keyword in education_keywords:
        matches = re.finditer(keyword, text_lower)
        for match in matches:
            # Extract surrounding context
            start = max(0, match.start() - 20)
            end = min(len(text), match.end() + 30)
            context = text[start:end].strip()
            found_education.append(context.title())
    
    return list(set(found_education))

def extract_email(text: str) -> Optional[str]:
    """Extract email address from text."""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text."""
    phone_patterns = [
        r'\+?1?\s*\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})',
        r'\+?(\d{1,3})[\s.-]?(\d{3,4})[\s.-]?(\d{3,4})[\s.-]?(\d{3,4})',
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None

def extract_keywords(text: str, top_n: int = 20) -> List[str]:
    """Extract most common keywords from text."""
    # Remove common words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
        'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their'
    }
    
    # Tokenize and clean
    words = re.findall(r'\b[a-z]{3,}\b', text.lower())
    filtered_words = [w for w in words if w not in stop_words]
    
    # Count frequencies
    word_counts = Counter(filtered_words)
    return [word for word, count in word_counts.most_common(top_n)]

def calculate_match_score(resume_text: str, job_description: str, 
                         required_skills: List[str]) -> MatchResult:
    """Calculate match score between resume and job description."""
    
    # Extract skills from both resume and job description
    resume_skills = set(s.lower() for s in extract_skills(resume_text))
    job_skills = set(s.lower() for s in extract_skills(job_description))
    required_skills_lower = set(s.lower() for s in required_skills)
    
    # Combine job description skills and explicitly required skills
    all_job_skills = job_skills.union(required_skills_lower)
    
    # Calculate skill matches
    matched_skills = resume_skills.intersection(all_job_skills)
    missing_skills = all_job_skills - resume_skills
    
    # Calculate base score from skill matching
    if len(all_job_skills) > 0:
        skill_match_ratio = len(matched_skills) / len(all_job_skills)
    else:
        skill_match_ratio = 0.5
    
    # Extract experience
    resume_experience = extract_experience_years(resume_text)
    job_experience = extract_experience_years(job_description)
    
    experience_match = True
    if job_experience and resume_experience:
        experience_match = resume_experience >= job_experience
    
    # Keyword matching
    resume_keywords = set(extract_keywords(resume_text, 30))
    job_keywords = set(extract_keywords(job_description, 30))
    keyword_overlap = len(resume_keywords.intersection(job_keywords))
    
    # Calculate final score (weighted)
    skill_score = skill_match_ratio * 60  # 60% weight on skills
    experience_score = 20 if experience_match else 10  # 20% weight
    keyword_score = min(keyword_overlap / 10, 1.0) * 20  # 20% weight
    
    final_score = int(skill_score + experience_score + keyword_score)
    final_score = max(0, min(100, final_score))  # Clamp between 0-100
    
    # Generate skill details
    skill_details = []
    for skill in all_job_skills:
        importance = 'critical' if skill in required_skills_lower else 'important'
        skill_details.append(SkillMatch(
            skill=skill.title(),
            found=skill in resume_skills,
            importance=importance
        ))
    
    # Generate suggestions
    suggestions = []
    if missing_skills:
        top_missing = list(missing_skills)[:5]
        suggestions.append(f"Add these missing skills: {', '.join(s.title() for s in top_missing)}")
    
    if not experience_match and job_experience:
        suggestions.append(f"Highlight {job_experience}+ years of relevant experience more prominently")
    
    if keyword_overlap < 5:
        suggestions.append("Use more keywords from the job description in your resume")
    
    if len(resume_skills) < 5:
        suggestions.append("Add more technical skills to strengthen your profile")
    
    # Generate strengths
    strengths = []
    if len(matched_skills) > 5:
        strengths.append(f"Strong skill match: {len(matched_skills)} relevant skills found")
    
    if experience_match:
        strengths.append("Experience level meets or exceeds requirements")
    
    if keyword_overlap > 10:
        strengths.append("Good keyword alignment with job description")
    
    if final_score >= 80:
        strengths.append("Excellent overall match - highly qualified candidate")
    
    return MatchResult(
        match_score=final_score,
        skills_matched=sorted([s.title() for s in matched_skills]),
        skills_missing=sorted([s.title() for s in missing_skills]),
        skill_details=skill_details,
        experience_match=experience_match,
        keyword_matches=keyword_overlap,
        suggestions=suggestions if suggestions else ["Resume looks great! Consider tailoring it more to this specific role."],
        strengths=strengths if strengths else ["Resume shows potential - highlight your achievements more clearly"]
    )

# API Endpoints
@app.get("/")
def read_root():
    return {
        "service": "AI Resume Matching Service",
        "version": "1.0.0",
        "status": "operational"
    }

@app.post("/parse-resume", response_model=ParsedResume)
async def parse_resume(request: ResumeParseRequest):
    """Parse resume and extract structured information."""
    try:
        skills = extract_skills(request.resume_text)
        experience_years = extract_experience_years(request.resume_text)
        education = extract_education(request.resume_text)
        keywords = extract_keywords(request.resume_text)
        email = extract_email(request.resume_text)
        phone = extract_phone(request.resume_text)
        
        return ParsedResume(
            skills=skills,
            experience_years=experience_years,
            education=education,
            keywords=keywords,
            email=email,
            phone=phone
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@app.post("/match", response_model=MatchResult)
async def match_resume_to_job(request: JobMatchRequest):
    """Calculate match score between resume and job description."""
    try:
        result = calculate_match_score(
            request.resume_text,
            request.job_description,
            request.required_skills
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating match: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-resume-matcher"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
