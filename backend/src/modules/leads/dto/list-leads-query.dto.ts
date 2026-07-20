import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LeadStatus } from '@prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Query params for GET /api/leads (admin list, Task 08/11). */
export class ListLeadsQueryDto {
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'status must be one of NEW, CONTACTED, QUALIFIED, WON, LOST, SPAM' })
  status?: LeadStatus;

  /** Matches name OR email OR company, case-insensitive. */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  assigneeId?: string;

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
