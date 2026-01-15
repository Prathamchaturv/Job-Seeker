import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { GetNearbyJobsDto } from './dto/get-nearby-jobs.dto';

/**
 * Jobs Service.
 *
 * Responsibilities:
 * - Business logic for job postings
 * - Geo-based job search using latitude and longitude
 * - Interaction with database layer
 */
@Injectable()
export class JobsService {
  // Mock data store (replace with database in production)
  private jobs: any[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      description: 'Looking for an experienced React developer...',
      domain: 'Technology',
      location: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
      employmentType: 'Full-time',
      salaryRange: '$120k - $180k',
      companyId: 'company1',
      companyName: 'TechCorp',
      requirements: ['React', 'TypeScript', '5+ years experience'],
      benefits: ['Health insurance', 'Remote work', '401k'],
      createdAt: new Date('2026-01-10'),
    },
    {
      id: '2',
      title: 'Data Scientist',
      description: 'Join our AI team to work on cutting-edge projects...',
      domain: 'Data Science',
      location: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.006,
      employmentType: 'Full-time',
      salaryRange: '$130k - $200k',
      companyId: 'company2',
      companyName: 'DataCorp',
      requirements: ['Python', 'Machine Learning', 'PhD preferred'],
      benefits: ['Health insurance', 'Stock options', 'Flexible hours'],
      createdAt: new Date('2026-01-12'),
    },
  ];

  /**
   * Calculate distance between two coordinates using Haversine formula.
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Create a new job posting.
   */
  async createJob(createJobDto: CreateJobDto, companyId: string) {
    const newJob = {
      id: `job_${Date.now()}`,
      ...createJobDto,
      companyId,
      companyName: 'Demo Company', // Replace with actual company lookup
      createdAt: new Date(),
    };

    this.jobs.push(newJob);

    return {
      success: true,
      data: newJob,
      message: 'Job posting created successfully',
    };
  }

  /**
   * Get nearby jobs based on location and filters.
   */
  async getNearbyJobs(query: GetNearbyJobsDto) {
    const { latitude, longitude, domain, sortBy } = query;
    const radius = query.radius ?? 10;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    // Calculate distance for each job
    let jobsWithDistance = this.jobs.map((job) => ({
      ...job,
      distance: this.calculateDistance(
        latitude,
        longitude,
        job.latitude,
        job.longitude,
      ),
    }));

    // Filter by radius
    jobsWithDistance = jobsWithDistance.filter(
      (job) => job.distance <= radius,
    );

    // Filter by domain if specified
    if (domain) {
      jobsWithDistance = jobsWithDistance.filter(
        (job) => job.domain.toLowerCase() === domain.toLowerCase(),
      );
    }

    // Sort
    if (sortBy === 'distance') {
      jobsWithDistance.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'createdAt') {
      jobsWithDistance.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = jobsWithDistance.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(jobsWithDistance.length / limit),
          totalJobs: jobsWithDistance.length,
          limit,
        },
      },
      message: 'Nearby jobs fetched successfully',
    };
  }

  /**
   * Get all available domains.
   */
  async getDomains() {
    const domains = [...new Set(this.jobs.map((job) => job.domain))];
    return {
      success: true,
      data: domains,
      message: 'Domains fetched successfully',
    };
  }

  /**
   * Get job by ID.
   */
  async getJobById(id: string) {
    const job = this.jobs.find((j) => j.id === id);

    if (!job) {
      return {
        success: false,
        data: null,
        message: 'Job not found',
      };
    }

    return {
      success: true,
      data: job,
      message: 'Job fetched successfully',
    };
  }
}
