import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { LeadStatus } from '@prisma/client';

/** Trim strings so admin edits do not persist stray leading/trailing space. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Admin edit payload for PATCH /api/leads/:id (Task 08/11). */
export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'status must be one of NEW, CONTACTED, QUALIFIED, WON, LOST, SPAM' })
  status?: LeadStatus;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(5000)
  adminNotes?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  assigneeId?: string;
}
