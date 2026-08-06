import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './leads.repository';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';
import { StorageService } from '../media/storage.service';

// MailService now comes from the global MailModule (imported in AppModule).
// StorageService is provided directly rather than by importing MediaModule:
// it depends only on ConfigService, and pulling in MediaModule would drag the
// whole media controller and its auth surface along for one file write.
@Module({
  controllers: [LeadsController],
  providers: [LeadsService, LeadsRepository, RecaptchaService, StorageService],
})
export class LeadsModule {}
