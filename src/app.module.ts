import { Module } from '@nestjs/common';
import { CoreModule } from './core/services/core.module';
import { AppService } from './app.service';
import { AccessTokenJwtGuard } from './common/guards/access-token.guard';
import { TransformationInterceptor } from './common/interceptors';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './app/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './app/notification/notification.module';
import { PostModule } from './app/post/post.module';
import { LoanRequestModule } from './app/loan_request/loan_request.module';
import { LoanRequestController } from './app/loan_request/loan_request.controller';
import { LoanRequestService } from './app/loan_request/loan_request.service';
import { BankModule } from './app/bank/bank.module';
import { BankCardModule } from './app/bank_card/bank_card.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    SwaggerModule,
    NotificationModule,
    // UserModule,
    AuthModule,
    // BlogModule,
    PostModule,
    LoanRequestModule,
    // OtpModule,
    BankModule,
    BankCardModule,
  ],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenJwtGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformationInterceptor,
    },
    LoanRequestService,
  ],
  exports: [],
  controllers: [LoanRequestController],
})
export class AppModule {}
