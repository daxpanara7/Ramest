import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { VerifyQueryDto } from './dto/verify.dto';
import { UnsubscribeQueryDto } from './dto/unsubscribe.dto';
import { ListSubscribersQueryDto } from './dto/list-subscribers.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ImportDto } from './dto/import.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletter: NewsletterService) {}

  /**
   * Public double opt-in signup. Rate-limited to 5/min per IP. Always returns
   * the same message — never reveals whether the email already existed.
   */
  @Public()
  @Post('subscribe')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async subscribe(@Body() dto: SubscribeDto, @Ip() ip: string) {
    return this.newsletter.subscribe(dto, { ip });
  }

  @Public()
  @Get('verify')
  async verify(@Query() query: VerifyQueryDto) {
    return this.newsletter.verify(query.token);
  }

  @Public()
  @Get('unsubscribe')
  async unsubscribe(@Query() query: UnsubscribeQueryDto) {
    return this.newsletter.unsubscribe(query.email, query.token);
  }

  @RequirePermissions('newsletter:read')
  @Get('subscribers')
  async list(@Query() query: ListSubscribersQueryDto) {
    return this.newsletter.list(query);
  }

  @RequirePermissions('newsletter:read')
  @Get('export')
  async export(@Res() res: Response): Promise<void> {
    const csv = await this.newsletter.exportActiveCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"');
    res.send(csv);
  }

  @RequirePermissions('newsletter:write')
  @Post('import')
  async import(
    @Body() dto: ImportDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.newsletter.import(dto.subscribers, { userId: user.id, ip });
  }

  @RequirePermissions('newsletter:write')
  @Patch('subscribers/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriberDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.newsletter.updateStatus(id, dto.status, { userId: user.id, ip });
  }

  @RequirePermissions('newsletter:write')
  @Delete('subscribers/:id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    await this.newsletter.remove(id, { userId: user.id, ip });
    return { ok: true };
  }
}
