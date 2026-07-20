import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './leads.repository';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';

// MailService now comes from the global MailModule (imported in AppModule).
@Module({
  controllers: [LeadsController],
  providers: [LeadsService, LeadsRepository, RecaptchaService],
})
export class LeadsModule {}
