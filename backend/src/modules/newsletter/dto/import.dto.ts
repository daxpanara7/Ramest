import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ImportSubscriberDto {
  @IsEmail({}, { message: 'A valid email is required' })
  @MaxLength(200)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}

/** Bulk import payload. Capped at 5000 rows per request. */
export class ImportDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5000)
  @ValidateNested({ each: true })
  @Type(() => ImportSubscriberDto)
  subscribers!: ImportSubscriberDto[];
}
