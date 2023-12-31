import { ParamSchema } from 'express-validator/src/middlewares/schema';
import { APP_MESSAGES } from '~/constants/message';
import Address from '~/models/typing/address';

export class ParamsValidation {
  public static email: ParamSchema = {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email is not valid',
    },
    notEmpty: {
      errorMessage: APP_MESSAGES.EMAIL_IS_REQUIRED,
    },
    trim: true,
  };
  public static password: ParamSchema = {
    in: ['body'],
    isLength: {
      errorMessage: APP_MESSAGES.PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARS_AND_LESS_THAN_32_CHARS,
      options: { min: 8, max: 32 },
    },
    trim: true,
    notEmpty: {
      errorMessage: APP_MESSAGES.PASSWORD_IS_REQUIRED,
    },
  };

  public static confirm_new_password: ParamSchema = {
    ...ParamsValidation.password,
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.new_password) {
          return false;
        }
        return true;
      },
    },
  };

  public static code: ParamSchema = {
    in: ['body'],
    notEmpty: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.OTP_CODE_IS_REQUIRED,
    },
    trim: true,
    isString: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.OTP_CODE_IS_REQUIRED,
    },
  };

  public static phone: ParamSchema = {
    in: ['body'],
    trim: true,
    isString: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.PHONE_IS_REQUIRED,
    },
    isMobilePhone: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.PHONE_IS_INVALID,
    },
  };

  public static address: ParamSchema = {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Address is required',
    },
    custom: {
      options: (value: Address) => {
        try {
          Address.fromJSON(value);
          return true;
        } catch (error) {
          return false;
        }
      },
      errorMessage: 'Address is not valid.',
    },
  };

  public static date: ParamSchema = {
    in: ['body'],
    isDate: true,
  };

  public static name: ParamSchema = {
    in: ['body'],
    trim: true,
    isString: {
      errorMessage: 'Name is not valid',
    },
    isLength: {
      errorMessage: 'Name must be at least 1 characters and less than 50 characters',
      options: { min: 1, max: 50 },
    },
  };

  public static gender: ParamSchema = {
    isBoolean: {
      errorMessage: 'Gender is boolean',
    },
  };

  public static uuid: ParamSchema = {
    in: ['params'],
    isUUID: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.IS_INVALID_ID,
    },
  };

  public static interest_rate: ParamSchema = {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Interest rate is not valid',
    },
    isFloat: {
      errorMessage: 'Interest rate is not valid',
    },
    custom: {
      options: (value: number) => {
        if (value < 0 || value > 1) {
          return false;
        }
        return true;
      },
      errorMessage: 'Interest rate is not valid',
    },
  };

  public static loan_amount: ParamSchema = {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Loan amount is not valid',
    },
    custom: {
      options: (value: number) => {
        if (value < 0) {
          return false;
        }
        return true;
      },
      errorMessage: 'Loan amount is not valid',
    },
  };

  public static loan_term: ParamSchema = {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Loan term is not valid',
    },
    isInt: {
      errorMessage: 'Loan term is not valid',
    },
    custom: {
      options: (value: number) => {
        if (value <= 0) {
          return false;
        }
        return true;
      },
      errorMessage: 'Loan term is not valid',
    },
  };

  public static tenure_months: ParamSchema = {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Tenure months is not valid',
    },
    isInt: {
      errorMessage: 'Tenure months is not valid',
    },
    custom: {
      options: (value: number) => {
        if (value <= 0) {
          return false;
        }
        return true;
      },
      errorMessage: 'Tenure months is not valid',
    },
  };
}
