import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Job Seeker Sign-up DTO.
 *
 * Fields:
 * - name
 * - email or phone
 * - password
 *
 * Validation rules applied.
 */
export class JobSeekerSignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class JobSeekerLoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

/**
 * Company Sign-up DTO.
 *
 * Fields:
 * - company name
 * - work email
 * - password
 *
 * Includes validation rules.
 */
export class CompanySignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  workEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class CompanyLoginDto {
  @IsEmail()
  @IsNotEmpty()
  workEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
