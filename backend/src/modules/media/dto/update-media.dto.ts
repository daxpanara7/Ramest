import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

/** Trim strings so " " does not pass validation and stored data is clean. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** PATCH /media/:id body — only the alt text is editable after upload. */
export class UpdateMediaDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  alt?: string;
}
