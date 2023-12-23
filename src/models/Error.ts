import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';

interface ErrorOptions {
  serverCode: number;
  details?: any;
  stack?: string;
}
export class AppError extends Error {
  status: string;
  statusCode: number = 500;
  isOperational: boolean;
  options: ErrorOptions;
  constructor(statusCode: number, message: string, options: ErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.options = options;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(details?: any) {
    return new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.NotFound, {
      serverCode: ServerCodes.CommomCode.NotFound,
      details,
    });
  }

  static badRequest(serverCode: number, message: string, details?: any) {
    return new AppError(HttpStatus.BAD_REQUEST, message, {
      serverCode: serverCode,
      details,
    });
  }
}
