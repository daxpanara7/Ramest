import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Unsubscribe link params. `email` is required to identify the subscriber;
 * `token` is optional and, when the subscriber still has a pending verifyToken
 * on file, must match it. Once a subscriber is verified the token is cleared
 * (per the verify flow) so unsubscribe falls back to email-only matching.
 */
export class UnsubscribeQueryDto {
  @Transform(trim)
  @IsEmail({}, { message: 'A valid email is required' })
  @MaxLength(200)
  email!: string;

  @IsOptional()
  @IsString()
  token?: string;
}
