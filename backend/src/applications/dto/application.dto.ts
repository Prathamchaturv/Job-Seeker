import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Apply for Job DTO.
 *
 * Fields for submitting a job application.
 */
export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsOptional()
  coverLetter?: string;

  @IsString()
  @IsOptional()
  resumeUrl?: string;
}

/**
 * Update Application Status DTO.
 *
 * Fields for updating an application's status.
 */
export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string; // 'pending', 'reviewing', 'interview', 'rejected', 'accepted'

  @IsString()
  @IsOptional()
  notes?: string;
}
