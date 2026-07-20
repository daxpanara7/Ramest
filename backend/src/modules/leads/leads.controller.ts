import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /**
   * Public endpoint the website contact form posts to. Rate-limited to 5
   * submissions per minute per IP (Task 04) on top of the global throttle.
   */
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
}
