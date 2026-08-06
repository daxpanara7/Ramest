import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/** Trim strings so " " does not pass @IsNotEmpty and stored data is clean. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Public careers-form payload. Arrives as multipart/form-data (the resume is
 * a file part), so every field lands here as a string — the global pipe's
 * implicit conversion handles `elapsedMs`.
 *
 * The file itself is NOT declared here: Multer strips it from the body before
 * validation runs, and `forbidNonWhitelisted` only sees the text fields.
 */
export class CreateApplicationDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Your full name is required' })
  @MaxLength(120)
  fullName!: string;

  @Transform(trim)
  @IsEmail({}, { message: 'A valid email is required' })
  @MaxLength(200)
  email!: string;

  /** Digits, spaces and the usual separators — deliberately permissive so
   *  international formats are not rejected at the border. */
  @Transform(trim)
  @IsString()
  @MinLength(7, { message: 'Please enter a valid mobile number' })
  @MaxLength(40)
  @Matches(/^[0-9+\-() .]+$/, { message: 'Please enter a valid mobile number' })
  phone!: string;

  /** Free text on purpose: "Fresher", "2.5 years" and "6+" are all real
   *  answers a candidate gives, and a number field would reject two of them. */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Total experience is required' })
  @MaxLength(60)
  totalExperience!: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Position applied for is required' })
  @MaxLength(160)
  position!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(3000)
  coverNote?: string;

  /** reCAPTCHA v3 token from the browser widget. */
  @IsOptional()
  @IsString()
  recaptchaToken?: string;

  /** Honeypot — see CreateLeadDto for the full reasoning. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  /** Milliseconds between the form rendering and the submit. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  elapsedMs?: number;
}
