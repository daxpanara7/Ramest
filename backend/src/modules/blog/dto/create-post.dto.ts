import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Admin create payload for a blog post. Slug is auto-derived when absent. */
export class CreatePostDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  /** Optional explicit slug; still run through slugify + uniqueness check. */
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

  /** Portable editor-block JSON. Shape is owned by the frontend editor. */
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
