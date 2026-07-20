import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { ExportLeadsQueryDto } from './dto/export-leads-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /**
   * Public endpoint the website contact form posts to. Rate-limited to 5
   * submissions per minute per IP (Task 04) on top of the global throttle.
   */
  @Public()
  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async submit(@Body() dto: CreateLeadDto, @Ip() ip: string, @Req() req: Request) {
    // Prefer the country header set by the CDN/proxy when present.
    const country =
      (req.headers['x-vercel-ip-country'] as string) ||
      (req.headers['cf-ipcountry'] as string) ||
      undefined;

    const result = await this.leads.create(dto, {
      ip,
      country,
      userAgent: req.headers['user-agent'],
    });

    // Same response whether or not it was spam-scored — never tell a bot.
    return {
      ok: true,
      id: result.id,
      message: 'Thanks — we have received your message and will reply within one business day.',
    };
  }

  /** Admin paginated list with status/search/assignee filters. */
  @RequirePermissions('lead:read')
  @Get()
  list(@Query() query: ListLeadsQueryDto) {
    return this.leads.list(query);
  }

  /** CSV export honoring the same status filter as the list. Declared before
   * `:id` so Nest does not swallow this path as an id lookup. */
  @RequirePermissions('lead:read')
  @Get('export')
  async export(@Query() query: ExportLeadsQueryDto, @Res() res: Response): Promise<void> {
    const csv = await this.leads.exportCsv(query.status);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  }

  /** Counts grouped by status. Declared before `:id` for the same reason. */
  @RequirePermissions('lead:read')
  @Get('stats')
  stats() {
    return this.leads.stats();
  }

  /** Single lead detail for the admin view. */
  @RequirePermissions('lead:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leads.findOne(id);
  }

  /** Admin edit: status / adminNotes / assigneeId. Audited. */
  @RequirePermissions('lead:write')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.leads.update(id, dto, user, ip);
  }

  /** Soft delete. Audited. */
  @RequirePermissions('lead:write')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.leads.remove(id, user, ip);
  }
}
