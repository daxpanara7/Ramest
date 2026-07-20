import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterRepository } from './newsletter.repository';

// PrismaService, MailService, and AuditService are global providers
// (PrismaModule / MailModule / AuditModule) — no need to import them here.
@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterRepository],
})
export class NewsletterModule {}
