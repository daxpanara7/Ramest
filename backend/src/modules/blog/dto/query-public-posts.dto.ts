import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Public list query for the Next.js frontend: ?categoryId=&tag=&skip=&take= */
export class QueryPublicPostsDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  /** Tag slug. */
  @IsOptional()
  @Transform(trim)
  @IsString()
  tag?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
