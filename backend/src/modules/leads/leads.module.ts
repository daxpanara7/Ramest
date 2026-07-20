import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { MailService } from '../../common/mail/mail.service';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, MailService, RecaptchaService],
})
export class LeadsModule {}
