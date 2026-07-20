import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Query params for GET /activity — filter by acting user and/or action, capped pagination. */
export class ListActivityDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  userId?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(120)
  action?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
