import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetNearbyJobsDto } from './dto/get-nearby-jobs.dto';

/**
 * Jobs Controller.
 *
 * Responsibilities:
 * - Create job postings (Company)
 * - Fetch nearby jobs based on location radius
 * - Filter jobs by domain
 *
 * Supports pagination and sorting.
 */
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Create a new job posting.
   * POST /jobs
   * Protected: Company only
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard, CompanyGuard) // Add authentication when ready
  async createJob(
    @Body() createJobDto: CreateJobDto,
    // @Request() req: any, // Uncomment when auth is implemented
  ) {
    // For now, use a mock company ID
    const companyId = 'mock_company_id';
    // const companyId = req.user.id; // Use when auth is implemented

    return this.jobsService.createJob(createJobDto, companyId);
  }

  /**
   * Get nearby jobs based on location.
   * GET /jobs/nearby?latitude=37.7749&longitude=-122.4194&radius=10&domain=Technology
   */
  @Get('nearby')
  @HttpCode(HttpStatus.OK)
  async getNearbyJobs(@Query() query: GetNearbyJobsDto) {
    return this.jobsService.getNearbyJobs(query);
  }

  /**
   * Get all available job domains.
   * GET /jobs/domains
   */
  @Get('domains')
  @HttpCode(HttpStatus.OK)
  async getDomains() {
    return this.jobsService.getDomains();
  }

  /**
   * Get job details by ID.
   * GET /jobs/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }
}
