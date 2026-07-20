import { IsEnum, IsOptional } from 'class-validator';
import { LeadStatus } from '@prisma/client';

/** Query params for GET /api/leads/export — same status filter as the list. */
export class ExportLeadsQueryDto {
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'status must be one of NEW, CONTACTED, QUALIFIED, WON, LOST, SPAM' })
  status?: LeadStatus;
}
