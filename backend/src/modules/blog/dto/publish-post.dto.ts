import { IsISO8601, IsOptional } from 'class-validator';

/** Publish payload. Omitting publishAt (or passing a past date) publishes now. */
export class PublishPostDto {
  @IsOptional()
  @IsISO8601()
  publishAt?: string;
}
