import { PrismaClient, UserRole, EmploymentType, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create Job Seekers
  const jobSeeker1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {
      password: hashedPassword,
      lastActive: new Date(),
    },
    create: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: UserRole.JOB_SEEKER,
      bio: 'Experienced full-stack developer with 5 years of experience',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      latitude: 37.7749,
      longitude: -122.4194,
      location: 'San Francisco, CA',
      preferredDomains: ['Technology', 'Software'],
    },
  });

  const jobSeeker2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: UserRole.JOB_SEEKER,
      bio: 'Data scientist passionate about machine learning',
      skills: ['Python', 'TensorFlow', 'SQL', 'Data Analysis'],
      latitude: 40.7128,
      longitude: -74.006,
      location: 'New York, NY',
      preferredDomains: ['Data Science', 'AI'],
    },
  });

  // Create Companies
  const company1 = await prisma.company.upsert({
    where: { workEmail: 'hr@techcorp.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      companyName: 'TechCorp Inc',
      workEmail: 'hr@techcorp.com',
      password: hashedPassword,
      role: UserRole.COMPANY,
      description: 'Leading technology company building innovative solutions',
      industry: 'Technology',
      website: 'https://techcorp.example.com',
      size: '200-500',
      latitude: 37.7749,
      longitude: -122.4194,
      location: 'San Francisco, CA',
    },
  });

  const company2 = await prisma.company.upsert({
    where: { workEmail: 'careers@datacorp.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      companyName: 'DataCorp Analytics',
      workEmail: 'careers@datacorp.com',
      password: hashedPassword,
      role: UserRole.COMPANY,
      description: 'Data analytics and AI solutions provider',
      industry: 'Data Science',
      website: 'https://datacorp.example.com',
      size: '50-200',
      latitude: 40.7128,
      longitude: -74.006,
      location: 'New York, NY',
    },
  });

  // Create Jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced React developer to join our team...',
      domain: 'Technology',
      latitude: 37.7749,
      longitude: -122.4194,
      location: 'San Francisco, CA',
      employmentType: EmploymentType.FULL_TIME,
      salaryRange: '$120k - $180k',
      requirements: ['5+ years React experience', 'TypeScript', 'Next.js'],
      benefits: ['Health insurance', 'Remote work', '401k', 'Stock options'],
      companyId: company1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Data Scientist',
      description: 'Join our AI team to work on cutting-edge machine learning projects...',
      domain: 'Data Science',
      latitude: 40.7128,
      longitude: -74.006,
      location: 'New York, NY',
      employmentType: EmploymentType.FULL_TIME,
      salaryRange: '$130k - $200k',
      requirements: ['PhD in CS/Statistics', 'Python', 'TensorFlow', '3+ years ML experience'],
      benefits: ['Health insurance', 'Stock options', 'Flexible hours', 'Learning budget'],
      companyId: company2.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'Backend Engineer',
      description: 'Build scalable microservices for our platform...',
      domain: 'Technology',
      latitude: 37.7849,
      longitude: -122.4094,
      location: 'San Francisco, CA',
      employmentType: EmploymentType.FULL_TIME,
      salaryRange: '$110k - $160k',
      requirements: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      benefits: ['Health insurance', 'Remote work', '401k'],
      companyId: company1.id,
    },
  });

  // Create Job Applications
  const application1 = await prisma.jobApplication.create({
    data: {
      jobId: job1.id,
      userId: jobSeeker1.id,
      coverLetter: 'I am excited to apply for the Senior Frontend Developer position...',
      status: ApplicationStatus.REVIEWING,
      matchScore: 92,
    },
  });

  const application2 = await prisma.jobApplication.create({
    data: {
      jobId: job2.id,
      userId: jobSeeker2.id,
      coverLetter: 'With my PhD in Machine Learning and 4 years of experience...',
      status: ApplicationStatus.INTERVIEW,
      matchScore: 95,
      interviewDate: new Date('2026-01-20T10:00:00'),
    },
  });

  // Create Notifications
  await prisma.notification.create({
    data: {
      title: 'Application Status Update',
      message: 'Your application for Senior Frontend Developer is now under review',
      type: 'status_update',
      userId: jobSeeker1.id,
      metadata: { jobId: job1.id, applicationId: application1.id },
    },
  });

  await prisma.notification.create({
    data: {
      title: 'New Application Received',
      message: 'John Doe applied for Senior Frontend Developer',
      type: 'application',
      companyId: company1.id,
      metadata: { jobId: job1.id, applicationId: application1.id },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log({
    jobSeekers: [jobSeeker1, jobSeeker2],
    companies: [company1, company2],
    jobs: [job1, job2, job3],
    applications: [application1, application2],
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
