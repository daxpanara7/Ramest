import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/** Trim strings so " " does not pass @IsNotEmpty and stored data is clean. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Public contact-form payload (Task 11). Every field is validated and length-
 * capped server-side — the client is never trusted. Unknown fields are stripped
 * by the global whitelist ValidationPipe.
 */
export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Transform(trim)
  @IsEmail({}, { message: 'A valid email is required' })
  @MaxLength(200)
  email!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(160)
  company?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(120)
  service?: string;

  @Transform(trim)
  @IsString()
  @MinLength(10, { message: 'Please add a little more detail' })
  @MaxLength(5000)
  message!: string;

  /** reCAPTCHA v3 token from the browser widget. */
  @IsOptional()
  @IsString()
  recaptchaToken?: string;
}
