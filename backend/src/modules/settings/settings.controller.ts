import {
  Body, Controller, Delete, Get, Ip, Param, Patch, Post, Query,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { BulkSettingsDto } from './dto/bulk-settings.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AuditService } from '../../common/audit/audit.service';

/**
 * Key/value store behind the admin Settings pages.
 *
 * Reads are gated on dashboard:read (anyone who can see the panel can read
 * its configuration); writes need role:write, because settings change how
 * the whole system behaves.
 */
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settings: SettingsService,
    private readonly audit: AuditService,
  ) {}

  @RequirePermissions('dashboard:read')
  @Get()
  list(@Query('prefix') prefix?: string) {
    return this.settings.list(prefix);
  }

  @RequirePermissions('dashboard:read')
  @Get(':key')
  get(@Param('key') key: string) {
    return this.settings.get(key);
  }

  @RequirePermissions('role:write')
  @Post()
  async upsert(
    @Body() dto: UpsertSettingDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    const row = await this.settings.upsert(dto);
    await this.audit.record({
      userId: user.id, action: 'setting.update', entity: 'Setting',
      entityId: dto.key, ip,
    });
    return row;
  }

  @RequirePermissions('role:write')
  @Patch()
  async bulk(
    @Body() dto: BulkSettingsDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    const result = await this.settings.upsertMany(dto.settings);
    await this.audit.record({
      userId: user.id, action: 'setting.bulk_update', entity: 'Setting',
      entityId: `${result.saved} keys`, ip,
    });
    return result;
  }

  @RequirePermissions('role:write')
  @Delete(':key')
  async remove(
    @Param('key') key: string,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    const res = await this.settings.remove(key);
    await this.audit.record({
      userId: user.id, action: 'setting.delete', entity: 'Setting',
      entityId: key, ip,
    });
    return res;
  }
}
