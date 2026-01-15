import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  JobSeekerSignupDto,
  JobSeekerLoginDto,
  CompanySignupDto,
  CompanyLoginDto,
} from './dto/auth.dto';
import { AuthResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Job Seeker Signup
   * POST /auth/job-seeker/signup
   */
  @Post('job-seeker/signup')
  @HttpCode(HttpStatus.CREATED)
  async jobSeekerSignup(
    @Body(ValidationPipe) dto: JobSeekerSignupDto,
  ): Promise<{ success: boolean; data: AuthResponse; message: string }> {
    const data = await this.authService.jobSeekerSignup(dto);
    return {
      success: true,
      data,
      message: 'Job seeker account created successfully',
    };
  }

  /**
   * Job Seeker Login
   * POST /auth/job-seeker/login
   */
  @Post('job-seeker/login')
  @HttpCode(HttpStatus.OK)
  async jobSeekerLogin(
    @Body(ValidationPipe) dto: JobSeekerLoginDto,
  ): Promise<{ success: boolean; data: AuthResponse; message: string }> {
    const data = await this.authService.jobSeekerLogin(dto);
    return {
      success: true,
      data,
      message: 'Login successful',
    };
  }

  /**
   * Company Signup
   * POST /auth/company/signup
   */
  @Post('company/signup')
  @HttpCode(HttpStatus.CREATED)
  async companySignup(
    @Body(ValidationPipe) dto: CompanySignupDto,
  ): Promise<{ success: boolean; data: AuthResponse; message: string }> {
    const data = await this.authService.companySignup(dto);
    return {
      success: true,
      data,
      message: 'Company account created successfully',
    };
  }

  /**
   * Company Login
   * POST /auth/company/login
   */
  @Post('company/login')
  @HttpCode(HttpStatus.OK)
  async companyLogin(
    @Body(ValidationPipe) dto: CompanyLoginDto,
  ): Promise<{ success: boolean; data: AuthResponse; message: string }> {
    const data = await this.authService.companyLogin(dto);
    return {
      success: true,
      data,
      message: 'Login successful',
    };
  }
}
