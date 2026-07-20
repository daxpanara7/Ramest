import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

/** Global so leads, newsletter, and auth can all inject MailService. */
@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
