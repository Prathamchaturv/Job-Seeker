/**
 * AI Service using Google Gemini.
 *
 * Features:
 * 1. Generate AI mock interview questions
 * 2. Analyze resume vs job description and return match score
 * 3. Build and optimize resumes using AI
 *
 * Rules:
 * - Use Gemini 1.5 model
 * - Keep prompts clean and reusable
 * - Return structured JSON responses
 * - Handle invalid AI responses safely
 */

import { Injectable, Logger } from '@nestjs/common';
import { getGeminiModel } from './gemini.client';

// Types for structured responses
export interface InterviewQuestion {
  id: number;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'general' | 'quantitative' | 'verbal';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
  options?: string[]; // MCQ options
  correctAnswer?: string; // Correct answer for MCQ
}

export interface ResumeMatchAnalysis {
  matchScore: number; // 0-100
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keySkillsMatched: string[];
  keySkillsMissing: string[];
}

export interface OptimizedResume {
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
    honors?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    duration: string;
    responsibilities: string[];
  }>;
  projects: Array<{
    name: string;
    institution?: string;
    duration?: string;
    description: string[];
    technologies: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  certifications?: string[];
  achievements?: string[];
  suggestions: string[];
}

export interface InterviewEvaluation {
  score: number; // 0-10
  strengths: string[];
  weaknesses: string[];
  missedPoints: string[];
  improvedAnswer: string;
  feedback: string;
}

export interface GroupDiscussionTopic {
  topic: string;
  category: string;
  context: string;
  keyPoints: string[];
}

export interface GroupDiscussionResponse {
  response: string;
  followUpQuestion?: string;
  feedback?: string;
  pointsMade: string[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly model;

  constructor() {
    // Use Gemini 1.5 Flash model (higher quota)
    // Free tier: 1500 requests/day vs 20/day for 2.5-flash
    // Get new key if needed from: https://aistudio.google.com/app/apikey
    this.model = getGeminiModel('gemini-1.5-flash');
  }

  /**
   * Prompt for generating AI mock interview questions.
   *
   * Input:
   * - Job role
   * - Experience level
   *
   * Output (JSON):
   * - Technical questions
   * - Behavioral questions
   * - Scenario-based questions
   *
   * Tone:
   * - Professional interviewer
   * - Real-world industry questions
   */
  async generateInterviewQuestions(
    jobRole: string,
    experienceLevel: string,
    numberOfQuestions: number = 5,
  ): Promise<InterviewQuestion[]> {
    try {
      const prompt = `You are a professional interviewer conducting a real-world industry interview for a ${experienceLevel} ${jobRole} position.

CRITICAL: Generate MULTIPLE CHOICE QUESTIONS (MCQ) that match the EXACT job role type:
- If role contains "Quantitative Aptitude" or "Math": Generate ONLY mathematical, numerical reasoning, and logic MCQs
- If role contains "Verbal Ability" or "English": Generate ONLY grammar, vocabulary, comprehension MCQs
- If role contains "Technical": Generate coding, algorithms, system design MCQs
- If role contains "HR" or "Behavioral": Generate behavioral, situational, personality MCQs
- If role contains "Group Discussion": Generate leadership, communication, teamwork MCQs

Generate exactly ${numberOfQuestions} MULTIPLE CHOICE interview questions.

EXAMPLES for different roles:
Quantitative Aptitude:
{
  "id": 1,
  "question": "A train 150 meters long crosses a platform in 15 seconds. If the speed of the train is 90 km/h, what is the length of the platform?",
  "options": ["225 meters", "250 meters", "275 meters", "300 meters"],
  "correctAnswer": "225 meters",
  "type": "quantitative",
  "difficulty": "medium",
  "expectedAnswer": "Calculate using: Platform length = (Speed × Time) - Train length"
}

Verbal Ability:
{
  "id": 1,
  "question": "Choose the correct synonym for 'METICULOUS':",
  "options": ["Careless", "Precise", "Simple", "Harsh"],
  "correctAnswer": "Precise",
  "type": "verbal",
  "difficulty": "easy",
  "expectedAnswer": "Meticulous means showing great attention to detail; being precise."
}

Requirements:
- Professional interviewer tone
- Real-world industry questions (not generic or theoretical)
- Appropriate difficulty for ${experienceLevel} level
- Exactly 4 options (A, B, C, D) for each question
- One clearly correct answer
- Return ONLY valid JSON array format

Format each question as:
{
  "id": <number>,
  "question": "<question text>",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "<one of the options that is correct>",
  "type": "technical|behavioral|situational|quantitative|verbal|general",
  "difficulty": "easy|medium|hard",
  "expectedAnswer": "<brief explanation of correct answer>"
}

Return JSON array: [question1, question2, ...]`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return this.parseJsonResponse<InterviewQuestion[]>(text);
    } catch (error) {
      this.logger.error(
        `Failed to generate interview questions: ${error.message}`,
      );
      
      // Fallback to predefined questions if AI fails
      this.logger.warn('Using fallback interview questions');
      return this.getFallbackInterviewQuestions(jobRole, experienceLevel, numberOfQuestions);
    }
  }

  /**
   * Fallback interview questions when AI service is unavailable
   */
  private getFallbackInterviewQuestions(
    jobRole: string,
    experienceLevel: string,
    numberOfQuestions: number,
  ): InterviewQuestion[] {
    // Determine question type based on role
    const isQuant = jobRole.toLowerCase().includes('quantitative') || jobRole.toLowerCase().includes('math');
    const isVerbal = jobRole.toLowerCase().includes('verbal') || jobRole.toLowerCase().includes('english');
    
    if (isQuant) {
      // Quantitative Aptitude MCQ Questions
      return [
        {
          id: 1,
          question: 'If 20% of A = 30% of B, what is the ratio A:B?',
          options: ['2:3', '3:2', '4:3', '3:4'],
          correctAnswer: '3:2',
          type: 'quantitative' as const,
          difficulty: 'medium' as const,
          expectedAnswer: 'A/B = 30/20 = 3/2, so A:B = 3:2',
        },
        {
          id: 2,
          question: 'A train 150 meters long crosses a platform in 15 seconds at 90 km/h. What is the platform length?',
          options: ['200 meters', '225 meters', '250 meters', '275 meters'],
          correctAnswer: '225 meters',
          type: 'quantitative' as const,
          difficulty: 'hard' as const,
          expectedAnswer: 'Speed = 90 km/h = 25 m/s. Distance = 25 × 15 = 375m. Platform = 375 - 150 = 225m',
        },
        {
          id: 3,
          question: 'What is the next number in the series: 2, 6, 12, 20, 30, ?',
          options: ['40', '42', '44', '48'],
          correctAnswer: '42',
          type: 'quantitative' as const,
          difficulty: 'medium' as const,
          expectedAnswer: 'Pattern: n(n+1). Next is 6×7 = 42',
        },
        {
          id: 4,
          question: 'If the cost price is 80% of the selling price, what is the profit percentage?',
          options: ['20%', '25%', '30%', '35%'],
          correctAnswer: '25%',
          type: 'quantitative' as const,
          difficulty: 'medium' as const,
          expectedAnswer: 'Profit = SP - CP = SP - 0.8SP = 0.2SP. Profit% = (0.2SP/0.8SP) × 100 = 25%',
        },
        {
          id: 5,
          question: 'A can complete a work in 12 days. B can complete the same work in 18 days. How many days will they take working together?',
          options: ['6.5 days', '7.2 days', '8 days', '9 days'],
          correctAnswer: '7.2 days',
          type: 'quantitative' as const,
          difficulty: 'hard' as const,
          expectedAnswer: 'Combined rate = 1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 days',
        },
      ].slice(0, numberOfQuestions);
    } else if (isVerbal) {
      // Verbal Ability MCQ Questions
      return [
        {
          id: 1,
          question: 'Choose the correct synonym for "METICULOUS":',
          options: ['Careless', 'Precise', 'Simple', 'Harsh'],
          correctAnswer: 'Precise',
          type: 'verbal' as const,
          difficulty: 'easy' as const,
          expectedAnswer: 'Meticulous means showing great attention to detail; being precise.',
        },
        {
          id: 2,
          question: 'Choose the correct antonym for "ABUNDANT":',
          options: ['Plentiful', 'Scarce', 'Sufficient', 'Ample'],
          correctAnswer: 'Scarce',
          type: 'verbal' as const,
          difficulty: 'easy' as const,
          expectedAnswer: 'Abundant means plentiful, so the opposite is scarce.',
        },
        {
          id: 3,
          question: 'Fill in the blank: "She has been working here _____ five years."',
          options: ['since', 'for', 'from', 'during'],
          correctAnswer: 'for',
          type: 'verbal' as const,
          difficulty: 'medium' as const,
          expectedAnswer: 'Use "for" with a period of time.',
        },
        {
          id: 4,
          question: 'Identify the error: "Each of the students have submitted their assignments."',
          options: ['No error', 'have should be has', 'their should be his', 'submitted should be submit'],
          correctAnswer: 'have should be has',
          type: 'verbal' as const,
          difficulty: 'medium' as const,
          expectedAnswer: '"Each" is singular, so the verb should be "has" not "have".',
        },
        {
          id: 5,
          question: 'Choose the correctly spelled word:',
          options: ['Occurance', 'Occurrence', 'Occurence', 'Occurrance'],
          correctAnswer: 'Occurrence',
          type: 'verbal' as const,
          difficulty: 'easy' as const,
          expectedAnswer: 'The correct spelling is "Occurrence" with double C and double R.',
        },
      ].slice(0, numberOfQuestions);
    }
    
    // Generic MCQ questions for other roles
    const questions: InterviewQuestion[] = [
      {
        id: 1,
        question: `What is the most important skill for a ${jobRole}?`,
        options: ['Technical expertise', 'Communication', 'Problem-solving', 'Time management'],
        correctAnswer: 'Problem-solving',
        type: 'general' as const,
        difficulty: 'easy' as const,
        expectedAnswer: 'Problem-solving is crucial for any technical role.',
      },
      {
        id: 2,
        question: 'In Agile methodology, what is a Sprint?',
        options: ['A bug in code', 'A time-boxed iteration', 'A type of test', 'A deployment process'],
        correctAnswer: 'A time-boxed iteration',
        type: 'technical' as const,
        difficulty: 'medium' as const,
        expectedAnswer: 'A Sprint is a fixed time period for completing work in Agile.',
      },
      {
        id: 3,
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Process Integration', 'Application Process Interface'],
        correctAnswer: 'Application Programming Interface',
        type: 'technical' as const,
        difficulty: 'easy' as const,
        expectedAnswer: 'API stands for Application Programming Interface.',
      },
      {
        id: 4,
        question: 'Which conflict resolution approach is most effective in a team?',
        options: ['Avoiding conflict', 'Forcing your solution', 'Collaborative problem-solving', 'Compromising always'],
        correctAnswer: 'Collaborative problem-solving',
        type: 'behavioral' as const,
        difficulty: 'medium' as const,
        expectedAnswer: 'Collaborative problem-solving leads to better team outcomes.',
      },
      {
        id: 5,
        question: 'What is the purpose of version control systems like Git?',
        options: ['Speed up code execution', 'Track changes in code', 'Compile code faster', 'Test code automatically'],
        correctAnswer: 'Track changes in code',
        type: 'technical' as const,
        difficulty: 'easy' as const,
        expectedAnswer: 'Version control systems track changes and enable collaboration.',
      },
    ];

    return questions.slice(0, numberOfQuestions);
  }

  /**
   * Prompt for resume and job description matching.
   *
   * Input:
   * - Resume text
   * - Job description text
   *
   * Output (JSON):
   * - Match score (0–100)
   * - Missing skills
   * - Strengths
   * - Improvement suggestions
   *
   * Rules:
   * - Be ATS friendly
   * - Evaluate skills realistically
   */
  async analyzeResumeMatch(
    resumeText: string,
    jobDescription: string,
  ): Promise<ResumeMatchAnalysis> {
    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Evaluate how well this resume matches the job description using realistic, industry-standard criteria.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Perform a comprehensive, ATS-friendly analysis and return results in JSON format:
{
  "matchScore": <0-100 realistic score based on actual skill and experience alignment>,
  "strengths": [<3-5 specific strengths where resume aligns with job requirements>],
  "gaps": [<3-5 specific qualifications or experiences the candidate lacks>],
  "recommendations": [<3-5 actionable improvement suggestions to increase match score>],
  "keySkillsMatched": [<specific technical and soft skills from resume that match job requirements>],
  "keySkillsMissing": [<required skills from job description not found in resume>]
}

Rules:
- Be ATS friendly: Focus on exact keyword matches and quantifiable achievements
- Evaluate skills realistically: Don't inflate scores; assess actual competency indicators
- Consider years of experience, education level, and certification requirements
- Identify transferable skills but note direct experience gaps
- Prioritize hard requirements over nice-to-haves

Return ONLY valid JSON format.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return this.parseJsonResponse<ResumeMatchAnalysis>(text);
    } catch (error) {
      this.logger.error(`Failed to analyze resume match: ${error.message}`);
      throw new Error('Failed to analyze resume match');
    }
  }

  /**
   * Prompt for AI resume builder.
   *
   * Input:
   * - User personal details
   * - Skills
   * - Experience
   * - Projects
   *
   * Output (JSON):
   * - Professional summary
   * - Experience bullet points
   * - Skills section
   * - Projects section
   *
   * Rules:
   * - ATS optimized
   * - Strong action verbs
   * - Professional tone
   */
  async optimizeResume(
    userProfile: {
      name: string;
      email?: string;
      phone?: string;
      city?: string;
      state?: string;
      linkedin?: string;
      github?: string;
      currentRole?: string;
      companyName?: string;
      experience?: string;
      skills?: string[];
      education?: string;
      universityName?: string;
      gpa?: string;
      achievements?: string[];
      projects?: string[];
    },
    targetRole: string,
  ): Promise<OptimizedResume> {
    try {
      // TEMPORARY FALLBACK: If AI quota exceeded, use template-based resume
      // This allows testing the feature while waiting for API quota reset
      const USE_FALLBACK = false; // Set to false when you have working API key
      
      if (USE_FALLBACK) {
        this.logger.warn('Using fallback resume generation (AI quota may be exceeded)');
        return this.generateFallbackResume(userProfile, targetRole);
      }
      
      const skillsList = userProfile.skills?.join(', ') || 'General skills';
      const achievementsList = userProfile.achievements?.join('; ') || 'Various achievements';
      const projectsList = userProfile.projects?.join('; ') || 'Personal projects';

      const prompt = `You are a professional resume writer. Create a complete, ATS-optimized resume for ${userProfile.name} applying for a ${targetRole} position.

CANDIDATE INFORMATION:
- Name: ${userProfile.name}
- Email: ${userProfile.email || 'Not provided'}
- Phone: ${userProfile.phone || 'Not provided'}
- Location: ${userProfile.city && userProfile.state ? `${userProfile.city}, ${userProfile.state}` : 'Not provided'}
- LinkedIn: ${userProfile.linkedin || 'Not provided'}
- GitHub: ${userProfile.github || 'Not provided'}
- Current Role: ${userProfile.currentRole || 'Recent Graduate'}
- Company: ${userProfile.companyName || 'Not provided'}
- Experience: ${userProfile.experience || 'Entry level'}
- Education: ${userProfile.education || 'Bachelor Degree in Computer Science'}
- University: ${userProfile.universityName || 'Not provided'}
- GPA: ${userProfile.gpa || 'Not provided'}
- Skills: ${skillsList}
- Achievements: ${achievementsList}
- Projects: ${projectsList}

TARGET POSITION: ${targetRole}

Generate a professional resume in JSON format with this EXACT structure:

{
  "contactInfo": {
    "name": "${userProfile.name}",
    "email": "${userProfile.email || `${userProfile.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}",
    "phone": "${userProfile.phone || '+1 (555) 123-4567'}",
    "location": "${userProfile.city && userProfile.state ? `${userProfile.city}, ${userProfile.state}` : 'Your City, State'}",
    "linkedin": "${userProfile.linkedin || `linkedin.com/in/${userProfile.name.toLowerCase().replace(/\s+/g, '-')}`}",
    "github": "${userProfile.github || `github.com/${userProfile.name.toLowerCase().replace(/\s+/g, '')}`}"
  },
  "summary": "Write a compelling 3-4 sentence professional summary highlighting relevant experience for ${targetRole}. Include specific technologies: ${skillsList}. Make it achievement-focused and quantify results where possible. Mention years of experience (${userProfile.experience || 'entry level'}) and career goals aligned with ${targetRole}.",
  "education": [
    {
      "degree": "${userProfile.education || 'Bachelor of Science in Computer Science'}",
      "institution": "${userProfile.universityName || 'University Name'}",
      "year": "2020-2024",
      "gpa": "${userProfile.gpa || '3.8'}",
      "honors": "Relevant coursework and academic achievements"
    }
  ],
  "experience": [
    {
      "title": "${userProfile.currentRole || 'Software Developer'}",
      "company": "${userProfile.companyName || 'Tech Company'}",
      "location": "${userProfile.city && userProfile.state ? `${userProfile.city}, ${userProfile.state}` : 'City, State'}",
      "duration": "${userProfile.experience || '2 years'}",
      "responsibilities": [
        "Write 5-6 STRONG achievement-focused bullet points using STAR method",
        "Start each with action verbs: Developed, Implemented, Led, Optimized, Architected",
        "Include specific metrics: improved performance by X%, reduced costs by Y%",
        "Mention technologies used from skills list: ${skillsList}",
        "Focus on ${targetRole} relevant accomplishments",
        "Show impact: user growth, revenue increase, time saved, efficiency gains"
      ]
    }
  ],
  "projects": [
    {
      "name": "Create project name from user's projects: ${projectsList}",
      "institution": "${userProfile.universityName || 'Personal Project'}",
      "duration": "3-6 months",
      "description": [
        "Write 4-5 achievement-focused bullet points for this project",
        "Explain the problem it solved and impact created",
        "Mention specific technologies used from skills list",
        "Include metrics: users, performance improvements, scale",
        "Show technical complexity and your contribution"
      ],
      "technologies": ["Select 3-5 most relevant from: ${skillsList}"]
    }
  ],
  "skills": {
    "technical": ${JSON.stringify(userProfile.skills || ['JavaScript', 'Python', 'React', 'Node.js'])},
    "soft": ["Communication", "Problem-solving", "Leadership", "Teamwork", "Adaptability"],
    "tools": ["Git", "VS Code", "Docker", "AWS", "Jira"]
  },
  "certifications": [],
  "achievements": ${JSON.stringify(userProfile.achievements || ['Delivered projects on time', 'Strong technical skills'])},
  "suggestions": [
    "Provide 5-6 specific, actionable suggestions to improve this resume for ${targetRole}",
    "Focus on: missing skills, recommended certifications, project improvements",
    "Suggest ways to better quantify achievements with metrics",
    "Recommend relevant learning paths and technologies to master",
    "Advise on how to make the resume more ATS-friendly for ${targetRole}"
  ]
}

IMPORTANT RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no extra text
2. Use realistic placeholders based on the user's information
3. Make achievements specific and quantifiable
4. Tailor everything to the ${targetRole} position
5. Ensure all JSON is properly formatted and parseable

Return the JSON now:`

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      this.logger.debug(`AI Resume Response: ${text.substring(0, 500)}...`);

      const parsedResume = this.parseJsonResponse<OptimizedResume>(text);
      
      // Validate that we have the required fields
      if (!parsedResume.contactInfo || !parsedResume.summary) {
        throw new Error('Invalid resume structure returned from AI');
      }

      return parsedResume;
    } catch (error) {
      this.logger.error(`Failed to optimize resume: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      
      // Check if it's a quota/API key issue
      if (error.message?.includes('quota') || error.message?.includes('API_KEY')) {
        throw new Error('AI API quota exceeded or invalid API key. Please update GEMINI_API_KEY in .env file.');
      }
      
      // Throw the actual error so frontend can display it
      throw new Error(`AI Resume generation failed: ${error.message}`);
    }
  }

  /**
   * Generate resume without AI (fallback for quota exceeded or API errors)
   * Creates a professional resume using template-based approach
   */
  private generateFallbackResume(
    userProfile: {
      name: string;
      email?: string;
      phone?: string;
      city?: string;
      state?: string;
      linkedin?: string;
      github?: string;
      currentRole?: string;
      companyName?: string;
      experience?: string;
      skills?: string[];
      education?: string;
      universityName?: string;
      gpa?: string;
      achievements?: string[];
      projects?: string[];
      projectDescriptions?: string[];
    },
    targetRole: string,
  ): OptimizedResume {
    const skills = userProfile.skills || ['JavaScript', 'TypeScript', 'React', 'Node.js'];
    const yearsExp = userProfile.experience || 'Entry level';
    const currentRole = userProfile.currentRole || 'Software Developer';
    const companyName = userProfile.companyName || 'Tech Company';
    const location = userProfile.city && userProfile.state 
      ? `${userProfile.city}, ${userProfile.state}` 
      : 'Your City, State';
    
    return {
      contactInfo: {
        name: userProfile.name,
        email: userProfile.email || `${userProfile.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone: userProfile.phone || '+1 (555) 123-4567',
        location: location,
        linkedin: userProfile.linkedin || 'linkedin.com/in/yourprofile',
        github: userProfile.github || 'github.com/yourprofile'
      },
      summary: `Results-driven ${currentRole} with ${yearsExp} of experience seeking to transition to a ${targetRole} role. Proven track record of delivering high-quality solutions using modern technologies including ${skills.slice(0, 3).join(', ')}. Strong problem-solving abilities and commitment to writing clean, maintainable code. Passionate about continuous learning and staying current with industry best practices.`,
      education: [
        {
          degree: userProfile.education || 'Bachelor of Science in Computer Science',
          institution: userProfile.universityName || 'University Name',
          year: '2020',
          gpa: userProfile.gpa || '3.8',
          honors: 'Cum Laude'
        }
      ],
      experience: [
        {
          title: currentRole,
          company: companyName,
          location: location,
          duration: yearsExp,
          responsibilities: [
            `Developed and maintained full-stack applications using ${skills.slice(0, 2).join(' and ')}`,
            'Collaborated with cross-functional teams to deliver features on time',
            'Implemented responsive UI components improving user experience by 40%',
            'Optimized application performance reducing load times by 30%',
            'Participated in code reviews and mentored junior developers'
          ]
        }
      ],
      projects: (userProfile.projects || ['Portfolio Website', 'Task Management App']).map((project, index) => {
        const descriptions = userProfile.projectDescriptions || [];
        const projectDesc = descriptions[index] || 'Built a full-stack application to solve real-world problems';
        
        return {
          name: project,
          institution: 'Personal Project',
          duration: '3 months',
          description: [
            projectDesc,
            `Implemented features including user authentication, data persistence, and responsive design`,
            `Deployed to production with CI/CD pipeline`
          ],
          technologies: skills.slice(0, 4)
        };
      }),
      skills: {
        technical: skills,
        soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Time Management', 'Adaptability'],
        tools: ['Git', 'VS Code', 'Docker', 'Postman', 'Jira']
      },
      certifications: [],
      achievements: userProfile.achievements || [
        'Successfully delivered 10+ projects on time and within budget',
        'Improved application performance by 40% through code optimization',
        'Received Employee of the Month award for outstanding contributions'
      ],
      suggestions: [
        '⚠️ NOTE: This resume was generated using a template (AI quota exceeded)',
        'Get a fresh API key from https://aistudio.google.com/app/apikey for AI-powered generation',
        'Quantify achievements with specific metrics and numbers',
        'Add more technical projects to demonstrate hands-on experience',
        `Consider obtaining certifications relevant to ${targetRole}`,
        'Include a portfolio link or GitHub profile with live project demos',
        'Tailor your resume for each specific job application'
      ]
    };
  }

  /**
   * Prompt for evaluating interview answers.
   *
   * Input:
   * - Interview question
   * - User answer
   * - Job role
   *
   * Output (JSON):
   * - Score (0–10)
   * - Strengths
   * - Weaknesses
   * - Missed points
   * - Improved sample answer
   *
   * Rules:
   * - Act like a senior interviewer
   * - Give constructive, honest feedback
   * - Keep feedback concise and actionable
   */
  async evaluateInterviewAnswer(
    question: string,
    userAnswer: string,
    jobRole: string,
    correctAnswer?: string,
  ): Promise<InterviewEvaluation> {
    try {
      // For MCQ questions, check if answer matches correct answer
      if (correctAnswer) {
        const isCorrect = userAnswer === correctAnswer
        
        return {
          score: isCorrect ? 10 : 0,
          strengths: isCorrect ? ['Selected the correct answer'] : [],
          weaknesses: isCorrect ? [] : [`Incorrect answer. Selected: "${userAnswer}"`],
          missedPoints: isCorrect ? [] : [`The correct answer is: "${correctAnswer}"`],
          improvedAnswer: isCorrect 
            ? 'Answer is correct' 
            : `The correct answer is "${correctAnswer}"`,
          feedback: isCorrect 
            ? 'Correct answer!' 
            : `Incorrect. The correct answer is "${correctAnswer}"`
        }
      }
      
      // For open-ended questions (fallback)
      const prompt = `You are a STRICT senior interviewer at a top tech company evaluating a candidate for a ${jobRole} position. You have HIGH STANDARDS and give low scores for inadequate answers.

Interview Question:
"${question}"

Candidate's Answer:
"${userAnswer}"

Evaluate this answer with HONEST, CRITICAL feedback. Do NOT be lenient.

Return your evaluation in JSON format:
{
  "score": <number 0-10, where 10 is perfect>,
  "strengths": [<2-3 specific things the candidate did well, ONLY if they actually did well>],
  "weaknesses": [<2-3 specific areas that need improvement>],
  "missedPoints": [<1-3 key points the candidate should have mentioned>],
  "improvedAnswer": "<a better version of the answer, 2-3 sentences, that addresses the weaknesses>",
  "feedback": "<1-2 sentence overall assessment with actionable advice>"
}

STRICT SCORING RULES:
- 0-2: Completely wrong, irrelevant, or "I don't know" type answers
- 3-4: Partially correct but missing major points or showing poor understanding
- 5-6: Mediocre answer with some correct points but significant gaps
- 7: Good answer covering most key points
- 8: Very good answer with depth and good understanding
- 9-10: Excellent answer demonstrating expert-level knowledge

IMPORTANT:
- Be HARSH with scoring - wrong or incomplete answers should get 0-4
- Empty, vague, or "I don't know" answers MUST score 0-2
- Don't give participation points - judge based on correctness only
- 8+ scores should be RARE and only for truly excellent answers

Return ONLY valid JSON format.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return this.parseJsonResponse<InterviewEvaluation>(text);
    } catch (error) {
      this.logger.error(
        `Failed to evaluate interview answer: ${error.message}`,
      );
      throw new Error('Failed to evaluate interview answer');
    }
  }

  /**
   * Parse JSON response from AI and handle invalid formats safely
   * @param text - Raw text response from AI
   * @returns Parsed JSON object
   */
  private parseJsonResponse<T>(text: string): T {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      
      // Remove ```json and ``` markers
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\n?/, '');
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\n?/, '');
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.replace(/\n?```$/, '');
      }

      // Parse JSON
      const parsed = JSON.parse(cleanText.trim());
      return parsed as T;
    } catch (error) {
      this.logger.error(`Failed to parse JSON response: ${error.message}`);
      this.logger.debug(`Raw response: ${text}`);
      throw new Error('Invalid JSON response from AI');
    }
  }

  /**
   * Generate personalized career advice based on user profile
   * @param userProfile - User's career information
   * @returns Career advice and recommendations
   */
  async generateCareerAdvice(userProfile: {
    currentRole: string;
    experience: string;
    skills: string[];
    goals?: string;
  }): Promise<{
    advice: string[];
    suggestedRoles: string[];
    skillsToLearn: string[];
    nextSteps: string[];
  }> {
    try {
      const prompt = `You are a career counselor. Provide personalized career advice based on:

Current Role: ${userProfile.currentRole}
Experience: ${userProfile.experience}
Skills: ${userProfile.skills.join(', ')}
Career Goals: ${userProfile.goals || 'Career growth and development'}

Provide advice in JSON format:
{
  "advice": [<3-5 personalized career advice points>],
  "suggestedRoles": [<5-7 suitable job roles to consider>],
  "skillsToLearn": [<5-7 in-demand skills to acquire>],
  "nextSteps": [<3-5 actionable next steps>]
}

Return ONLY valid JSON format.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return this.parseJsonResponse(text);
    } catch (error) {
      this.logger.error(`Failed to generate career advice: ${error.message}`);
      throw new Error('Failed to generate career advice');
    }
  }

  /**
   * Generate a random group discussion topic
   */
  async generateDiscussionTopic(): Promise<GroupDiscussionTopic> {
    try {
      const prompt = `Generate a random, engaging group discussion topic suitable for interview assessment.

Return ONLY valid JSON (no markdown, no explanation):
{
  "topic": "<the discussion topic>",
  "category": "<Current Affairs|Technology|Business|Social Issues|Ethics|Environment>",
  "context": "<brief context or background about the topic>",
  "keyPoints": [<3-5 important points to consider in the discussion>]
}

Topics should be:
- Current and relevant
- Thought-provoking
- Suitable for evaluating communication and critical thinking
- Not too controversial or sensitive`;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const topicData = JSON.parse(cleanedText);
      
      return {
        topic: topicData.topic,
        category: topicData.category,
        context: topicData.context,
        keyPoints: topicData.keyPoints
      };
    } catch (error) {
      this.logger.error('Failed to generate discussion topic:', error);
      
      // Fallback topics
      const fallbackTopics: GroupDiscussionTopic[] = [
        {
          topic: "Should artificial intelligence be regulated by governments?",
          category: "Technology",
          context: "With rapid AI advancement, concerns about ethics, job displacement, and safety are growing.",
          keyPoints: [
            "Balance between innovation and safety",
            "Potential risks of unregulated AI",
            "Impact on employment and economy",
            "Privacy and data concerns",
            "International cooperation needed"
          ]
        },
        {
          topic: "Is remote work the future of employment?",
          category: "Business",
          context: "Post-pandemic, many companies are rethinking traditional office-based work models.",
          keyPoints: [
            "Productivity and work-life balance",
            "Company culture and team collaboration",
            "Cost savings vs. infrastructure challenges",
            "Environmental impact",
            "Hybrid models as compromise"
          ]
        },
        {
          topic: "Should social media platforms be held responsible for fake news?",
          category: "Social Issues",
          context: "Misinformation spreads rapidly on social media, influencing public opinion and elections.",
          keyPoints: [
            "Free speech vs. content moderation",
            "Platform liability and responsibility",
            "User education and media literacy",
            "Technology solutions (AI detection)",
            "Impact on democracy and society"
          ]
        },
        {
          topic: "Is climate change the biggest challenge facing humanity?",
          category: "Environment",
          context: "Global temperatures rising, extreme weather events increasing, urgent action needed.",
          keyPoints: [
            "Scientific consensus and evidence",
            "Economic vs. environmental priorities",
            "Individual vs. collective responsibility",
            "Renewable energy transition",
            "Global cooperation required"
          ]
        },
        {
          topic: "Should college education be free for all?",
          category: "Social Issues",
          context: "Student debt crisis and educational inequality are major concerns in many countries.",
          keyPoints: [
            "Access to education as a right",
            "Economic feasibility and funding",
            "Quality of education concerns",
            "Impact on job market and economy",
            "Alternative models (vocational training)"
          ]
        }
      ];
      
      return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
    }
  }

  /**
   * Generate AI response for group discussion (conversational mode)
   */
  async generateDiscussionResponse(
    topic: string,
    userStatement: string,
    conversationHistory: Array<{ role: 'user' | 'ai', message: string }>
  ): Promise<GroupDiscussionResponse> {
    try {
      const historyText = conversationHistory
        .map(msg => `${msg.role === 'user' ? 'Participant' : 'AI'}: ${msg.message}`)
        .join('\n');

      const prompt = `You are participating in a group discussion on the topic: "${topic}"

Conversation history:
${historyText}

Participant's latest statement: "${userStatement}"

As an AI participant in this discussion:
1. Respond thoughtfully to the participant's point
2. Add your own perspective or counterargument
3. Ask a follow-up question to keep the discussion going
4. Identify key points made by the participant
5. Keep responses conversational and engaging (2-3 sentences max)

Return ONLY valid JSON (no markdown):
{
  "response": "<your response to the participant's statement>",
  "followUpQuestion": "<a question to encourage further discussion>",
  "feedback": "<brief evaluation of the participant's point - was it relevant, well-argued, etc.>",
  "pointsMade": [<list of key points the participant made in their statement>]
}`;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const responseData = JSON.parse(cleanedText);
      
      return {
        response: responseData.response,
        followUpQuestion: responseData.followUpQuestion,
        feedback: responseData.feedback,
        pointsMade: responseData.pointsMade || []
      };
    } catch (error) {
      this.logger.error('Failed to generate discussion response:', error);
      
      return {
        response: "That's an interesting point. Could you elaborate on that?",
        followUpQuestion: "What are your thoughts on the opposing viewpoint?",
        feedback: "Good participation. Try to provide more specific examples.",
        pointsMade: []
      };
    }
  }
}
