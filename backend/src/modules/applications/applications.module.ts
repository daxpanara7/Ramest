import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationsRepository } from './applications.repository';
import { ResumeStorageService } from './resume-storage.service';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';

// PrismaService, AuditService and MailService are global (PrismaModule /
// AuditModule / MailModule in AppModule) — no need to import them here.
@Module({
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationsRepository,
    ResumeStorageService,
    RecaptchaService,
  ],
})
export class ApplicationsModule {}
