# Job Search Platform - Database Schema

## Setup Instructions

### 1. Install Prisma Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Update the `.env` file with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/jobsearch?schema=public"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run Database Migrations
```bash
npm run prisma:migrate
```
This will create all tables in your database based on the schema.

### 5. Seed Database (Optional)
```bash
npm run prisma:seed
```
This will populate the database with sample data for testing.

### 6. Open Prisma Studio (Optional)
```bash
npm run prisma:studio
```
Opens a GUI to browse and edit your database data at http://localhost:5555

## Database Models

### User (Job Seeker)
- Role-based authentication
- Profile information (bio, skills, experience, education)
- Geo-location fields (latitude, longitude, location)
- Preferred domains and search radius
- Relationships: applications, notifications

### Company
- Company profile (name, description, industry, website, logo, size)
- Geo-location fields for office location
- Relationships: jobs, notifications

### Job
- Job details (title, description, domain, employment type, salary)
- Geo-location fields (latitude, longitude) for proximity search
- Requirements and benefits arrays
- Status tracking (active, view count, application count)
- Relationships: company, applications

### JobApplication
- Links users and jobs (with unique constraint to prevent duplicates)
- Application details (cover letter, resume URL)
- Status tracking (pending, reviewing, interview, accepted, rejected)
- AI match score
- Interview scheduling
- Company notes

### Notification
- Real-time notification system
- Polymorphic relationships (can belong to User or Company)
- Type-based notifications (application, status_update, new_job, interview)
- Read/unread status
- Metadata for additional context

## Key Features

### Geo-Location Search
- Latitude/longitude fields with indexes for fast proximity queries
- Haversine formula implementation in service layer
- Configurable search radius

### Role-Based Access
- `UserRole` enum: JOB_SEEKER, COMPANY, ADMIN
- Separate models for users and companies
- Role-based route protection

### Application Tracking
- Complete application lifecycle management
- Status updates with timestamps
- Interview scheduling
- Match scoring

### Indexes
- Email, phone, geo-coordinates for fast lookups
- Status and date fields for filtering
- Composite indexes for common queries

## Migration Commands

```bash
# Create a new migration
npm run prisma:migrate

# Reset database (warning: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Deploy migrations to production
npx prisma migrate deploy
```
