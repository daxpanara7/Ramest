import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpsertSettingDto } from './upsert-setting.dto';

/** Settings pages save a whole form at once, so writes are batched. */
export class BulkSettingsDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => UpsertSettingDto)
  settings!: UpsertSettingDto[];
}
