import { Global, Module } from '@nestjs/common';
import MailTrapProvider from './mail/mail-trap.provider';
import { PrismaService } from './prisma/prisma.service';
import { ZaloPayService } from './payment/zalopay.service';
import { ConfigService } from '@nestjs/config';
import { EnvConstants } from 'src/common/constants';

@Global()
@Module({
  providers: [
    {
      provide: 'MailProvider',
      useClass: MailTrapProvider,
    },
    PrismaService,
    {
      provide: ZaloPayService,
      useFactory: (configService: ConfigService) => {
        return new ZaloPayService(
          configService.get<string>(EnvConstants.zalopayAPI),
          configService.get<string>(EnvConstants.zalopaySandboxPrivateKey),
          configService.get<string>(EnvConstants.zalopaySandboxAppId),
          configService.get<string>(EnvConstants.zalopaySandboxKey1),
          configService.get<string>(EnvConstants.zalopaySandboxKey2),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    {
      provide: 'MailProvider',
      useClass: MailTrapProvider,
    },
    PrismaService,
    ZaloPayService,
  ],
})
export class CoreModule {}
