# Test the AI Resume Matching Service

import requests
import json

BASE_URL = "http://localhost:8000"

def test_parse_resume():
    print("\n🧪 Testing Resume Parsing...\n")
    
    resume_text = """
    John Doe
    Email: john.doe@example.com
    Phone: +1-555-123-4567
    
    PROFESSIONAL SUMMARY
    Senior Full-Stack Developer with 7 years of experience building scalable web applications.
    Expert in React, TypeScript, Node.js, and PostgreSQL. Strong background in cloud architecture
    and microservices.
    
    TECHNICAL SKILLS
    - Programming: JavaScript, TypeScript, Python, Java
    - Frontend: React, Next.js, Vue.js, HTML, CSS
    - Backend: Node.js, Express, Django, FastAPI
    - Databases: PostgreSQL, MongoDB, Redis
    - Cloud: AWS, Docker, Kubernetes
    - Tools: Git, CI/CD, Agile, TDD
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology, 2015
    
    EXPERIENCE
    Senior Software Engineer | TechCorp Inc. | 2019 - Present
    - Led development of microservices architecture
    - Improved application performance by 40%
    - Mentored junior developers
    """
    
    response = requests.post(f"{BASE_URL}/parse-resume", json={
        "resume_text": resume_text
    })
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Resume parsed successfully!\n")
        print(f"📋 Skills Found: {len(result['skills'])}")
        print(f"   {', '.join(result['skills'][:10])}...\n")
        print(f"💼 Experience: {result['experience_years']} years\n")
        print(f"🎓 Education: {result['education']}\n")
        print(f"📧 Email: {result['email']}")
        print(f"📱 Phone: {result['phone']}\n")
        return result
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

def test_job_matching():
    print("\n🎯 Testing Job Matching...\n")
    
    resume_text = """
    Jane Smith - Senior Python Developer
    Email: jane.smith@example.com
    
    Experienced backend developer with 5 years in Python ecosystem.
    Specialized in building RESTful APIs with Django and FastAPI.
    
    Technical Skills:
    - Python, Django, FastAPI, Flask
    - PostgreSQL, MongoDB, Redis
    - Docker, Kubernetes, AWS
    - Git, CI/CD, Agile methodologies
    
    Experience:
    Backend Developer | DataCorp | 2019 - Present
    - Built scalable APIs serving 1M+ users
    - Implemented caching strategies with Redis
    - Deployed applications on AWS with Docker
    """
    
    job_description = """
    Senior Backend Engineer
    
    We are looking for an experienced Python developer to join our team.
    You will be responsible for building and maintaining our backend services.
    
    Required Skills:
    - 5+ years of Python development experience
    - Strong experience with FastAPI or Django
    - PostgreSQL database design and optimization
    - Docker and container orchestration
    - RESTful API design principles
    - AWS cloud services
    
    Nice to have:
    - Redis caching
    - Microservices architecture
    - CI/CD pipeline experience
    """
    
    response = requests.post(f"{BASE_URL}/match", json={
        "resume_text": resume_text,
        "job_description": job_description,
        "job_title": "Senior Backend Engineer",
        "required_skills": [
            "Python", "FastAPI", "Django", "PostgreSQL", "Docker", "AWS", "Redis"
        ]
    })
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Job matching completed!\n")
        print(f"🎯 Match Score: {result['match_score']}/100\n")
        
        print(f"✅ Skills Matched ({len(result['skills_matched'])}):")
        for skill in result['skills_matched'][:5]:
            print(f"   ✓ {skill}")
        print()
        
        if result['skills_missing']:
            print(f"❌ Skills Missing ({len(result['skills_missing'])}):")
            for skill in result['skills_missing'][:5]:
                print(f"   ✗ {skill}")
            print()
        
        print(f"💡 Suggestions:")
        for i, suggestion in enumerate(result['suggestions'], 1):
            print(f"   {i}. {suggestion}")
        print()
        
        print(f"💪 Strengths:")
        for strength in result['strengths']:
            print(f"   • {strength}")
        print()
        
        return result
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

def test_health():
    print("\n🏥 Testing Health Check...\n")
    
    response = requests.get(f"{BASE_URL}/health")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Service Status: {result['status']}")
        print(f"   Service: {result['service']}\n")
        return True
    else:
        print(f"❌ Service unavailable")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("AI RESUME MATCHING SERVICE - TEST SUITE")
    print("=" * 60)
    
    # Test health check
    if not test_health():
        print("\n⚠️  Service is not running. Start it with: python main.py")
        exit(1)
    
    # Test resume parsing
    test_parse_resume()
    
    # Test job matching
    test_job_matching()
    
    print("=" * 60)
    print("✨ All tests completed!")
    print("=" * 60)
