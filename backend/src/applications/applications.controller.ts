import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApplyJobDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

/**
 * Job Application Controller.
 *
 * Responsibilities:
 * - Apply for a job
 * - Update application status
 * - Fetch application tracking details
 *
 * Supports real-time status updates.
 */
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Apply for a job.
   * POST /applications
   * Protected: Job Seeker only
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard, JobSeekerGuard) // Add authentication when ready
  async applyForJob(
    @Body() applyJobDto: ApplyJobDto,
    // @Request() req: any, // Uncomment when auth is implemented
  ) {
    // For now, use a mock job seeker ID
    const jobSeekerId = 'mock_seeker_id';
    // const jobSeekerId = req.user.id; // Use when auth is implemented

    return this.applicationsService.applyForJob(applyJobDto, jobSeekerId);
  }

  /**
   * Get my applications (Job Seeker view).
   * GET /applications/my
   * Protected: Job Seeker only
   */
  @Get('my')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard, JobSeekerGuard)
  async getMyApplications(
    // @Request() req: any,
  ) {
    const jobSeekerId = 'mock_seeker_id';
    // const jobSeekerId = req.user.id;

    return this.applicationsService.getMyApplications(jobSeekerId);
  }

  /**
   * Get application statistics.
   * GET /applications/stats
   * Protected: Job Seeker only
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard, JobSeekerGuard)
  async getApplicationStats(
    // @Request() req: any,
  ) {
    const jobSeekerId = 'mock_seeker_id';
    // const jobSeekerId = req.user.id;

    return this.applicationsService.getApplicationStats(jobSeekerId);
  }

  /**
   * Get applications for a specific job (Company view).
   * GET /applications/job/:jobId
   * Protected: Company only
   */
  @Get('job/:jobId')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard, CompanyGuard)
  async getJobApplications(
    @Param('jobId') jobId: string,
    // @Request() req: any,
  ) {
    const companyId = 'mock_company_id';
    // const companyId = req.user.id;

    return this.applicationsService.getJobApplications(jobId, companyId);
  }

  /**
   * Get application by ID.
   * GET /applications/:id
   * Protected: Authenticated users
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  async getApplicationById(
    @Param('id') id: string,
    // @Request() req: any,
  ) {
    const userId = 'mock_user_id';
    // const userId = req.user.id;

    return this.applicationsService.getApplicationById(id, userId);
  }

  /**
   * Update application status (Company only).
   * PUT /applications/:id/status
   * Protected: Company only
   */
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard, CompanyGuard)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
    // @Request() req: any,
  ) {
    const companyId = 'mock_company_id';
    // const companyId = req.user.id;

    return this.applicationsService.updateApplicationStatus(
      id,
      updateDto,
      companyId,
    );
  }
}
