import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

/** Trim strings so " " does not pass validation and stored data is clean. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Public subscribe payload (double opt-in). Never trust the client. */
export class SubscribeDto {
  @Transform(trim)
  @IsEmail({}, { message: 'A valid email is required' })
  @MaxLength(200)
  email!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(120)
  name?: string;

  /** Where the signup came from, e.g. "footer", "blog". */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  source?: string;
}
