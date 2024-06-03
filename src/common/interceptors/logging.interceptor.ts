import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();
      const method = request.method;
      const url = request.url;
      const now = Date.now();

      return next.handle().pipe(
        tap(() => {
          this.logger.log(
            `${method} ${url} ${response.statusCode} ${Date.now() - now}ms`,
          );
        }),
      );
    } else if (context.getType() === 'rpc') {
      const ctx = context.switchToRpc();
      const pattern = ctx.getContext().getPattern();
      const data = ctx.getData();
      const now = Date.now();

      return next.handle().pipe(
        tap(() => {
          this.logger.log(`${pattern} ${data} ${Date.now() - now}ms`);
        }),
      );
    } else if (context.getType() === 'ws') {
      const ctx = context.switchToWs();
      const client = ctx.getClient();
      const data = ctx.getData();
      const now = Date.now();

      return next.handle().pipe(
        tap(() => {
          this.logger.log(`${client.id} ${data} ${Date.now() - now}ms`);
        }),
      );
    } else {
      this.logger.warn('Unknown context type');
      return next.handle();
    }
  }
}
