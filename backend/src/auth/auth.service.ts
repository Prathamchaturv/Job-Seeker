import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  JobSeekerSignupDto,
  JobSeekerLoginDto,
  CompanySignupDto,
  CompanyLoginDto,
} from './dto/auth.dto';
import { User, UserRole, AuthResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hashed password
   */
  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Remove password from user object
   */
  private sanitizeUser(user: any): User {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Job Seeker Signup
   */
  async jobSeekerSignup(dto: JobSeekerSignupDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.emailOrPhone },
          { phone: dto.emailOrPhone },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email/phone already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(dto.password);

    // Determine if emailOrPhone is email or phone
    const isEmail = dto.emailOrPhone.includes('@');

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: isEmail ? dto.emailOrPhone : null,
        phone: isEmail ? null : dto.emailOrPhone,
        password: hashedPassword,
        role: UserRole.JOB_SEEKER,
      },
    });

    // Generate token
    const token = this.generateToken(this.sanitizeUser(user));

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Job Seeker Login
   */
  async jobSeekerLogin(dto: JobSeekerLoginDto): Promise<AuthResponse> {
    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.emailOrPhone },
          { phone: dto.emailOrPhone },
        ],
      },
    });

    if (!user || user.role !== UserRole.JOB_SEEKER) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last active
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    // Generate token
    const token = this.generateToken(this.sanitizeUser(user));

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Company Signup
   */
  async companySignup(dto: CompanySignupDto): Promise<AuthResponse> {
    // Check if company already exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { workEmail: dto.workEmail },
    });

    if (existingCompany) {
      throw new ConflictException('Company with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(dto.password);

    // Create company user
    const company = await this.prisma.company.create({
      data: {
        companyName: dto.companyName,
        workEmail: dto.workEmail,
        password: hashedPassword,
        role: UserRole.COMPANY,
      },
    });

    // Generate token
    const token = this.generateToken({
      ...this.sanitizeUser(company),
      email: company.workEmail,
    });

    return {
      token,
      user: {
        ...this.sanitizeUser(company),
        email: company.workEmail,
      },
    };
  }

  /**
   * Company Login
   */
  async companyLogin(dto: CompanyLoginDto): Promise<AuthResponse> {
    // Find company
    const company = await this.prisma.company.findUnique({
      where: { workEmail: dto.workEmail },
    });

    if (!company || company.role !== UserRole.COMPANY) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(
      dto.password,
      company.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last active
    await this.prisma.company.update({
      where: { id: company.id },
      data: { lastActive: new Date() },
    });

    // Generate token
    const token = this.generateToken({
      ...this.sanitizeUser(company),
      email: company.workEmail,
    });

    return {
      token,
      user: {
        ...this.sanitizeUser(company),
        email: company.workEmail,
      },
    };
  }

  /**
   * Validate user by ID (for JWT strategy)
   */
  async validateUser(userId: string): Promise<User | null> {
    // Try to find in User table
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      return this.sanitizeUser(user);
    }

    // Try to find in Company table
    const company = await this.prisma.company.findUnique({
      where: { id: userId },
    });

    if (company) {
      return {
        ...this.sanitizeUser(company),
        email: company.workEmail,
      };
    }

    return null;
  }
}
