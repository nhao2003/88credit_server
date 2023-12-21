import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';

interface ErrorOptions {
  statusCode: number;
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
      statusCode: ServerCodes.CommomCode.NotFound,
      details,
    });
  }
}
