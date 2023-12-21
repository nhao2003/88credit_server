import { checkSchema } from 'express-validator';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import { AppError } from '~/models/Error';
import { UserPayload, VerifyResult, verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { UserStatus } from '~/constants/enum';
import AuthServices from '~/services/auth.service';
import ServerCodes from '~/constants/server_codes';
import { ParamsValidation } from './validation/params_validation';
import { User } from '~/models/databases/User';
import { Service } from 'typedi';

@Service()
class AuthValidation {
  private authServices: AuthServices;
  constructor(auth: AuthServices) {
    this.authServices = auth;
  }
  public readonly signUpValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        password: ParamsValidation.password,
        confirmPassword: {
          ...ParamsValidation.password,
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.password) {
                return false;
              }
              return true;
            },
          },
        },
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = await this.authServices.checkUserExistByEmail(email);
      if (user) {
        return res.status(HttpStatus.CONFLICT).json({
          status: 'error',
          code: ServerCodes.AuthCode.EmailAlreadyExsist,
          message: APP_MESSAGES.ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        });
      }
      next();
    },
  ];
  public readonly signInValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        password: ParamsValidation.password,
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const { user, password_is_correct } = await this.authServices.getUserByEmailAndPassword(email, password);
      if (user === null || user === undefined) {
        return next(AppError.notFound(APP_MESSAGES.USER_NOT_FOUND));
      }
      if (user.status === UserStatus.unverified) {
        // return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.USER_NOT_VERIFIED, {
          statusCode: ServerCodes.AuthCode.UserIsNotVerified,
        });
      }
      if (password_is_correct === false) {
        // return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 400));
        throw new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, {
          statusCode: ServerCodes.AuthCode.InvalidCredentials,
        });
      }
      req.user = user;
      next();
    },
  ];

  public readonly acctiveAccountValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
      password: ParamsValidation.password,
      code: ParamsValidation.code,
    }),
  );

  public readonly resendActivationCodeValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
    }),
  );

  public readonly accessTokenValidation = [
    validate(
      checkSchema({
        Authorization: {
          in: ['headers'],
          notEmpty: {
            errorMessage: APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
          },
          trim: true,
        },
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;
      const access_token = authorization?.split(' ')[1];
      if (!access_token) {
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, {
            statusCode: ServerCodes.AuthCode.AccessTokenIsRequired,
          }),
        );
      }
      const result = await verifyToken(access_token, process.env.JWT_SECRET_KEY as string);
      if (!result) {
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
          statusCode: ServerCodes.AuthCode.InvalidCredentials,
        });
      }
      if (result.expired || !result.payload) {
        // return next(new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
          statusCode: ServerCodes.AuthCode.TokenIsExpired,
        });
      }
      const session = await this.authServices.checkSessionExist((result.payload as UserPayload).session_id);
      if (session === null || session === undefined) {
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
          statusCode: ServerCodes.AuthCode.InvalidCredentials,
        });
      }
      const user = await this.authServices.checkUserExistByID(session.user_id);
      if (user === null || user === undefined) {
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
          statusCode: ServerCodes.AuthCode.InvalidCredentials,
        });
      }
      req.user = user;
      req.session = session;
      next();
    },
  ];

  public refreshTokenValidation = validate(
    checkSchema({
      refresh_token: {
        in: ['body'],
        notEmpty: {
          errorMessage: APP_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        },
        trim: true,
        isString: true,
      },
    }),
  );

  public readonly forgotPasswordValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
    }),
  );

  public readonly verifyRecoveryTokenValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
      code: ParamsValidation.code,
    }),
  );

  public readonly resetPasswordValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        code: ParamsValidation.code,
        new_password: {
          ...ParamsValidation.password,
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.confirm_password) {
                // throw new AppError(APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
                return false;
              }
              return true;
            },
          },
        },
      }),
    ),
    // async (req: Request, res: Response, next: NextFunction) => {
    //   const { email, code } = req.body;
    //   const userService = new AuthServices();
    //   const user = await userService.checkUserExistByEmail(email);
    //   if (user === undefined || user === null) {
    //     return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    //   }
    //   const otp = await userService.getOTP(user.id, code, 'reset-password');
    //   if (otp === null) {
    //     return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
    //   }
    //   next();
    // },
  ];

  tokenValidation = [
    validate(
      checkSchema({
        Authorization: {
          in: ['headers'],
          notEmpty: {
            errorMessage: APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
          },
          trim: true,
        },
      }),
    ),
    wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (!accessToken) {
        return false;
      }
      const result = await verifyToken(accessToken, process.env.JWT_SECRET_KEY as string);
      if (!result) {
        // throw new AppError(APP_MESSAGES.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
          statusCode: ServerCodes.AuthCode.InvalidCredentials,
        });
      }
      if (result.expired || !result.payload) {
        throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
          statusCode: ServerCodes.AuthCode.TokenIsExpired,
        });
      }
      (req as Request).verifyResult = result;
      return next();
    }),
  ];

  protect = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { payload, expired } = req.verifyResult as VerifyResult;

    if (payload !== null && !expired) {
      const userRepo = User.getRepository();
      const user = await userRepo.findOne({ where: { id: (payload as UserPayload).id } });
      if (user !== null) {
        if (user.status === UserStatus.unverified) {
          // return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
          throw new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.USER_NOT_VERIFIED, {
            statusCode: ServerCodes.AuthCode.UserIsNotVerified,
          });
        } else {
          return next();
        }
      } else {
        next(AppError.notFound(APP_MESSAGES.USER_NOT_FOUND));
      }
    }
    if (expired) {
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
        statusCode: ServerCodes.AuthCode.TokenIsExpired,
      });
      next(error);
    }
    const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
      statusCode: ServerCodes.AuthCode.InvalidCredentials,
    });
    next(error);
  });

  changePasswordValidation = validate(
    checkSchema({
      newPassword: {
        in: ['body'],
        isLength: {
          errorMessage: APP_MESSAGES.PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARS_AND_LESS_THAN_32_CHARS,
          options: { min: 8, max: 32 },
        },
        trim: true,
        notEmpty: {
          errorMessage: APP_MESSAGES.PASSWORD_IS_REQUIRED,
        },
      },
    }),
  );
}

export default AuthValidation;