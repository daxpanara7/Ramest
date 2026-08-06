import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApplicationStatus } from '@prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const STATUS_MESSAGE =
  'status must be one of NEW, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, HIRED, REJECTED, SPAM';

/** Query params for GET /api/applications (admin list). */
export class ListApplicationsQueryDto {
  @IsOptional()
  @IsEnum(ApplicationStatus, { message: STATUS_MESSAGE })
  status?: ApplicationStatus;

  /** Matches name OR email OR position, case-insensitive. */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(200)
  search?: string;

  /** Exact position filter, so the admin can review one role at a time. */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(160)
  position?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  /** Capped at 100 in the service regardless of what is requested here. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
