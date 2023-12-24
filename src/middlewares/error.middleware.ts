import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';
import { AppError } from '~/models/Error';
import appConfig from '~/constants/configs';
const handleValidationErrorDB = (err: any) => {
  const details = Object.values(err.errors).map((el: any) => {
    return {
      path: el.path,
      message: el.message,
    };
  });
  return new AppError(400, APP_MESSAGES.INVALID_INPUT_DATA, {
    serverCode: HttpStatus.BAD_REQUEST,
    details,
  });
};

const handleUserInputError = (error: any): AppError => {
  console.log('handleUserInputError');
  console.log(error);
  const keyValue = error.keyValue;
  return new AppError(400, APP_MESSAGES.INVALID_INPUT_DATA, {
    serverCode: HttpStatus.BAD_REQUEST,
    details: keyValue,
  });
};

const handleDevelopmentError = (err: Error, res: Response) => {
  const error = { ...err } as any;
  res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: error.status || 'error',
    code: error?.options?.serverCode || ServerCodes.CommomCode.InternalServerError,
    message: err.message,
    error,
  });
};

const handleProductionError = (err: any, res: Response) => {
  console.log('Production error: ', err);
  if (err.isOperational !== undefined && err.isOperational) {
    console.log('OPERATIONAL ERROR');
    const error = err as AppError;
    res.status(error.statusCode).json({
      status: (error.status as 'fail' | 'error') || 'success',
      code: error?.options?.serverCode || ServerCodes.CommomCode.InternalServerError,
      message: error.message,
      result: {
        details: error.options.details,
      },
    });
  } else {
    console.log('PROGRAMMING ERROR');
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      code: 500,
      message: APP_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const isProduction = appConfig.isProduction;
  const isDevelopment = !isProduction;
  console.log('ERROR HANDLER');
  console.log(process.env.NODE_ENV);
  if (isDevelopment) console.log(err);
  if (isDevelopment) {
    handleDevelopmentError(err, res);
  } else if (isProduction) {
    console.log('PRODUCTION ERROR');
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleUserInputError(error);
    if (error.name === 'JsonWebTokenError')
      error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
        serverCode: ServerCodes.AuthCode.InvalidCredentials,
      });
    if (error.name === 'TokenExpiredError')
      error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
        serverCode: ServerCodes.AuthCode.TokenIsExpired,
      });
    handleProductionError(error, res);
  } else {
    throw new Error('NODE_ENV is not set');
  }
};
