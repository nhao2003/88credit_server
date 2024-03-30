import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './common/database/database.module';
import { SwaggerModule } from './common/swagger/swagger.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AccessTokenJwtGuard } from './common/guards/access-token.guard';
import { TransformationInterceptor } from './common/interceptors';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    SwaggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
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
  ],
})
export class AppModule {}
