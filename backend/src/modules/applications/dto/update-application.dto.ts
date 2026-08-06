import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApplicationStatus } from '@prisma/client';

/** Trim strings so admin edits do not persist stray leading/trailing space. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Admin edit payload for PATCH /api/applications/:id. */
export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus, {
    message:
      'status must be one of NEW, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, HIRED, REJECTED, SPAM',
  })
  status?: ApplicationStatus;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(5000)
  adminNotes?: string;
}
