import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { GeminiService } from './gemini.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// DTOs for request validation
class GenerateQuestionsDto {
  @IsString()
  @IsNotEmpty()
  jobRole: string;

  @IsString()
  @IsNotEmpty()
  experienceLevel: string;

  @IsNumber()
  @IsOptional()
  numberOfQuestions?: number;
}

class AnalyzeResumeDto {
  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;
}

class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  github?: string;

  @IsString()
  @IsOptional()
  currentRole?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  education?: string;

  @IsString()
  @IsOptional()
  universityName?: string;

  @IsString()
  @IsOptional()
  gpa?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  projects?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  projectDescriptions?: string[];
}

class OptimizeResumeDto {
  @ValidateNested()
  @Type(() => UserProfileDto)
  @IsNotEmpty()
  userProfile: UserProfileDto;

  @IsString()
  @IsNotEmpty()
  targetRole: string;
}

class CareerProfileDto {
  @IsString()
  @IsNotEmpty()
  currentRole: string;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  skills: string[];

  @IsString()
  @IsOptional()
  goals?: string;
}

class CareerAdviceDto {
  @ValidateNested()
  @Type(() => CareerProfileDto)
  @IsNotEmpty()
  userProfile: CareerProfileDto;
}

class EvaluateAnswerDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

class QuestionDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  difficulty?: string;

  @IsString()
  @IsOptional()
  expectedAnswer?: string;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;
}

class EvaluateInterviewDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsNotEmpty()
  questions: QuestionDto[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  answers: string[];

  @IsString()
  @IsNotEmpty()
  role: string;
}

/**
 * AI Controller.
 *
 * Endpoints:
 * - POST /ai/mock-interview
 * - POST /ai/job-match
 * - POST /ai/build-resume
 * - POST /ai/interview-feedback
 *
 * Access:
 * - Authenticated users only
 *
 * Responsibilities:
 * - Validate request body
 * - Call AI service
 * - Return AI-generated results
 */
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  /**
   * POST /ai/mock-interview
   * Generate mock interview questions based on job role and experience level
   */
  @Post('mock-interview')
  @HttpCode(HttpStatus.OK)
  async generateInterviewQuestions(@Body() dto: GenerateQuestionsDto) {
    try {
      if (!dto.jobRole || !dto.experienceLevel) {
        throw new BadRequestException(
          'jobRole and experienceLevel are required',
        );
      }

      const questions = await this.geminiService.generateInterviewQuestions(
        dto.jobRole,
        dto.experienceLevel,
        dto.numberOfQuestions || 5,
      );

      return {
        success: true,
        data: {
          jobRole: dto.jobRole,
          experienceLevel: dto.experienceLevel,
          questions,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /ai/job-match
   * Analyze resume against job description and return match score
   */
  @Post('job-match')
  @HttpCode(HttpStatus.OK)
  async analyzeResume(@Body() dto: AnalyzeResumeDto) {
    try {
      if (!dto.resumeText || !dto.jobDescription) {
        throw new BadRequestException(
          'resumeText and jobDescription are required',
        );
      }

      const analysis = await this.geminiService.analyzeResumeMatch(
        dto.resumeText,
        dto.jobDescription,
      );

      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /ai/build-resume
   * Build and optimize resume using AI based on user profile
   */
  @Post('build-resume')
  @HttpCode(HttpStatus.OK)
  async optimizeResume(@Body() dto: OptimizeResumeDto) {
    try {
      if (!dto.userProfile || !dto.targetRole) {
        throw new BadRequestException('userProfile and targetRole are required');
      }

      if (!dto.userProfile.name) {
        throw new BadRequestException('userProfile.name is required');
      }

      const optimizedResume = await this.geminiService.optimizeResume(
        dto.userProfile,
        dto.targetRole,
      );

      return {
        success: true,
        data: optimizedResume,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /api/ai/career-advice
   * Generate personalized career advice
   */
  @Post('career-advice')
  @HttpCode(HttpStatus.OK)
  async getCareerAdvice(@Body() dto: CareerAdviceDto) {
    try {
      if (!dto.userProfile) {
        throw new BadRequestException('userProfile is required');
      }

      const {
        currentRole,
        experience,
        skills,
      } = dto.userProfile;

      if (!currentRole || !experience || !skills || skills.length === 0) {
        throw new BadRequestException(
          'currentRole, experience, and skills are required',
        );
      }

      const advice = await this.geminiService.generateCareerAdvice(
        dto.userProfile,
      );

      return {
        success: true,
        data: advice,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /ai/interview-feedback
   *
   * Request Body:
   * - question
   * - answer
   * - role
   *
   * Response:
   * - Score
   * - Strengths
   * - Weaknesses
   * - Suggested improved answer
   */
  @Post('interview-feedback')
  @HttpCode(HttpStatus.OK)
  async evaluateAnswer(@Body() dto: EvaluateAnswerDto) {
    try {
      if (!dto.question || !dto.answer || !dto.role) {
        throw new BadRequestException(
          'question, answer, and role are required',
        );
      }

      const evaluation = await this.geminiService.evaluateInterviewAnswer(
        dto.question,
        dto.answer,
        dto.role,
      );

      return {
        success: true,
        data: evaluation,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /ai/evaluate-interview
   * Evaluate complete mock interview with multiple questions and answers
   *
   * Request Body:
   * - questions: Array of interview questions with expected answers
   * - answers: Array of user's answers
   * - role: Job role being interviewed for
   *
   * Response:
   * - Overall score
   * - Individual question evaluations
   * - Correct/incorrect status for each question
   */
  @Post('evaluate-interview')
  @HttpCode(HttpStatus.OK)
  async evaluateInterview(@Body() dto: EvaluateInterviewDto) {
    try {
      if (!dto.questions || !dto.answers || !dto.role) {
        throw new BadRequestException('questions, answers, and role are required');
      }

      if (dto.questions.length !== dto.answers.length) {
        throw new BadRequestException('Number of questions and answers must match');
      }

      // Evaluate each answer
      const evaluations = await Promise.all(
        dto.questions.map(async (question, index) => {
          const evaluation = await this.geminiService.evaluateInterviewAnswer(
            question.question,
            dto.answers[index],
            dto.role,
            question.correctAnswer, // Pass correct answer for MCQ evaluation
          );
          
          return {
            questionId: question.id,
            question: question.question,
            answer: dto.answers[index],
            expectedAnswer: question.expectedAnswer,
            correctAnswer: question.correctAnswer,
            evaluation,
            isCorrect: evaluation.score >= 8, // Score 8+ (80%) is considered correct
          };
        }),
      );

      // Calculate overall stats
      const totalQuestions = evaluations.length;
      const correctAnswers = evaluations.filter(e => e.isCorrect).length;
      const averageScore = evaluations.reduce((sum, e) => sum + e.evaluation.score, 0) / totalQuestions;
      const overallScore = Math.round((averageScore / 10) * 100); // Convert to percentage

      return {
        success: true,
        data: {
          overallScore,
          averageScore: Math.round(averageScore * 10) / 10,
          correctAnswers,
          totalQuestions,
          evaluations,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /ai/discussion-topic
   * Generate a random group discussion topic
   */
  @Post('discussion-topic')
  @HttpCode(HttpStatus.OK)
  async generateDiscussionTopic() {
    try {
      const topic = await this.geminiService.generateDiscussionTopic();
      return {
        success: true,
        data: topic,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * POST /ai/discussion-response
   * Generate AI response for group discussion
   */
  @Post('discussion-response')
  @HttpCode(HttpStatus.OK)
  async generateDiscussionResponse(@Body() dto: {
    topic: string;
    userStatement: string;
    conversationHistory: Array<{ role: 'user' | 'ai', message: string }>;
  }) {
    try {
      if (!dto.topic || !dto.userStatement) {
        throw new BadRequestException('topic and userStatement are required');
      }

      const response = await this.geminiService.generateDiscussionResponse(
        dto.topic,
        dto.userStatement,
        dto.conversationHistory || []
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
