import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

/** Query params for GET /api/applications/export — same filter as the list. */
export class ExportApplicationsQueryDto {
  @IsOptional()
  @IsEnum(ApplicationStatus, {
    message:
      'status must be one of NEW, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, HIRED, REJECTED, SPAM',
  })
  status?: ApplicationStatus;
}
