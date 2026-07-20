import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Admin partial-update payload. Every field is optional — only what's sent
 * gets patched. Declared explicitly (rather than PartialType) since
 * @nestjs/mapped-types is not a project dependency.
 */
export class UpdatePostDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(160)
  slug?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  contentJson?: unknown;

  @IsOptional()
  @IsString()
  contentHtml?: string;

  @IsOptional()
  @IsString()
  coverImageId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(300)
  metaDescription?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  canonicalUrl?: string;

  @IsOptional()
  @IsBoolean()
  noindex?: boolean;
}
