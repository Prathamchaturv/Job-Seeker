export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  COMPANY = 'COMPANY',
}

export interface User {
  id: string;
  name?: string;
  companyName?: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}
