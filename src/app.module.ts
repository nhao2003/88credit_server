import { Module } from '@nestjs/common';
import { CoreModule } from './core/services/core.module';
import { AppService } from './app.service';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './app/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './app/notification/notification.module';
import { PostModule } from './app/post/post.module';
import { LoanRequestModule } from './app/loan_request/loan_request.module';
import { LoanRequestService } from './app/loan_request/loan_request.service';
import { BankModule } from './app/bank/bank.module';
import { BankCardModule } from './app/bank_card/bank_card.module';
import { LoanContractModule } from './app/loan_contract/loan_contract.module';
import { BlogModule } from './app/blog/blog.module';
import { AppController } from './app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';

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
    BlogModule,
    PostModule,
    LoanRequestModule,
    // OtpModule,
    BankModule,
    BankCardModule,
    LoanContractModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    LoanRequestService,
  ],
  exports: [],
  controllers: [AppController],
})
export class AppModule {}
