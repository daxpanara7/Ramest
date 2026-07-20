import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SubscriberStatus } from '@prisma/client';

/** Admin list query — pagination + optional status filter and email search. */
export class ListSubscribersQueryDto {
  @IsOptional()
  @IsEnum(SubscriberStatus)
  status?: SubscriberStatus;

  @IsOptional()
  @IsString()
  search?: string;

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
