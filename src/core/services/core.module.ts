import { Global, Module } from '@nestjs/common';
import MailTrapProvider from './mail/mail-trap.provider';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: 'MailProvider',
      useClass: MailTrapProvider,
    },
    PrismaService,
  ],
  exports: [
    {
      provide: 'MailProvider',
      useClass: MailTrapProvider,
    },
    PrismaService,
  ],
})
export class CoreModule {}
