import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  password!: string;

  /**
   * reCAPTCHA v3 token. Optional at the DTO layer so the field can be absent
   * in local dev where captcha is disabled; the controller is what enforces
   * it once RECAPTCHA_SECRET_KEY is configured.
   */
  @IsOptional()
  @IsString()
  recaptchaToken?: string;
}
