import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import MailTrapProvider from 'src/core/services/mail/mail-trap.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class NotificationModule {}
