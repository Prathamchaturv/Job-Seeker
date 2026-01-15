import { Injectable } from '@nestjs/common';
import { ApplyJobDto, UpdateApplicationStatusDto } from './dto/application.dto';

/**
 * Applications Service.
 *
 * Handles business logic for job applications.
 */
@Injectable()
export class ApplicationsService {
  // Mock data store (replace with database in production)
  private applications: any[] = [
    {
      id: 'app1',
      jobId: '1',
      jobTitle: 'Senior Frontend Developer',
      companyName: 'TechCorp',
      jobSeekerId: 'seeker1',
      applicantName: 'John Doe',
      status: 'reviewing',
      appliedAt: new Date('2026-01-10'),
      coverLetter: 'I am excited to apply...',
      resumeUrl: 'https://example.com/resume.pdf',
      matchScore: 92,
    },
    {
      id: 'app2',
      jobId: '2',
      jobTitle: 'Data Scientist',
      companyName: 'DataCorp',
      jobSeekerId: 'seeker1',
      applicantName: 'John Doe',
      status: 'interview',
      appliedAt: new Date('2026-01-12'),
      coverLetter: 'I have extensive experience...',
      resumeUrl: 'https://example.com/resume.pdf',
      matchScore: 88,
      interviewDate: new Date('2026-01-20T10:00:00'),
    },
  ];

  /**
   * Apply for a job.
   */
  async applyForJob(applyJobDto: ApplyJobDto, jobSeekerId: string) {
    const { jobId, coverLetter, resumeUrl } = applyJobDto;

    // Check if already applied
    const existingApplication = this.applications.find(
      (app) => app.jobId === jobId && app.jobSeekerId === jobSeekerId,
    );

    if (existingApplication) {
      return {
        success: false,
        data: null,
        message: 'You have already applied for this job',
      };
    }

    const newApplication = {
      id: `app_${Date.now()}`,
      jobId,
      jobTitle: 'Mock Job Title', // Replace with actual job lookup
      companyName: 'Mock Company', // Replace with actual company lookup
      jobSeekerId,
      applicantName: 'Mock Applicant', // Replace with actual user lookup
      status: 'pending',
      appliedAt: new Date(),
      coverLetter,
      resumeUrl,
      matchScore: Math.floor(Math.random() * 30) + 70, // Mock match score 70-100
    };

    this.applications.push(newApplication);

    return {
      success: true,
      data: newApplication,
      message: 'Application submitted successfully',
    };
  }

  /**
   * Get applications for a job seeker.
   */
  async getMyApplications(jobSeekerId: string) {
    const userApplications = this.applications.filter(
      (app) => app.jobSeekerId === jobSeekerId,
    );

    return {
      success: true,
      data: userApplications,
      message: 'Applications fetched successfully',
    };
  }

  /**
   * Get applications for a specific job (Company view).
   */
  async getJobApplications(jobId: string, companyId: string) {
    // TODO: Verify that the job belongs to this company
    const jobApplications = this.applications.filter(
      (app) => app.jobId === jobId,
    );

    return {
      success: true,
      data: jobApplications,
      message: 'Job applications fetched successfully',
    };
  }

  /**
   * Get application by ID.
   */
  async getApplicationById(id: string, userId: string) {
    const application = this.applications.find((app) => app.id === id);

    if (!application) {
      return {
        success: false,
        data: null,
        message: 'Application not found',
      };
    }

    // Verify user has access to this application
    // (either job seeker who applied or company that posted the job)
    // TODO: Add proper authorization check

    return {
      success: true,
      data: application,
      message: 'Application fetched successfully',
    };
  }

  /**
   * Update application status (Company only).
   */
  async updateApplicationStatus(
    applicationId: string,
    updateDto: UpdateApplicationStatusDto,
    companyId: string,
  ) {
    const application = this.applications.find(
      (app) => app.id === applicationId,
    );

    if (!application) {
      return {
        success: false,
        data: null,
        message: 'Application not found',
      };
    }

    // TODO: Verify that the job belongs to this company

    application.status = updateDto.status;
    if (updateDto.notes) {
      application.notes = updateDto.notes;
    }
    application.updatedAt = new Date();

    // TODO: Send notification to job seeker about status change

    return {
      success: true,
      data: application,
      message: 'Application status updated successfully',
    };
  }

  /**
   * Get application statistics for a job seeker.
   */
  async getApplicationStats(jobSeekerId: string) {
    const userApplications = this.applications.filter(
      (app) => app.jobSeekerId === jobSeekerId,
    );

    const stats = {
      total: userApplications.length,
      pending: userApplications.filter((app) => app.status === 'pending')
        .length,
      reviewing: userApplications.filter((app) => app.status === 'reviewing')
        .length,
      interview: userApplications.filter((app) => app.status === 'interview')
        .length,
      accepted: userApplications.filter((app) => app.status === 'accepted')
        .length,
      rejected: userApplications.filter((app) => app.status === 'rejected')
        .length,
    };

    return {
      success: true,
      data: stats,
      message: 'Application statistics fetched successfully',
    };
  }
}
