import { BaseExceptionFilter, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { EnvConstants } from './common/constants';

// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     console.error(exception);
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//     const message =
//       exception instanceof HttpException
//         ? exception.message
//         : 'Internal Server Error';
//     return throwError(() => new HttpException(message, status));
//   }
// }

async function bootstrap() {
  const rabbitmqHost = process.env[EnvConstants.RABBITMQ_HOST] || 'localhost';
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://guest:guest@' + rabbitmqHost + ':5672'],
  //     queue: 'server_queue',
  //   },
  // });
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@' + rabbitmqHost + ':5672'],
      queue: 'server_queue',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(2020);
}
bootstrap();
