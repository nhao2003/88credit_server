import { checkSchema } from 'express-validator';
import { Service } from 'typedi';
import { validate } from '~/utils/validation';
@Service()
export class BankAccountValidate {
  public createBankAccount = [
    validate(
      checkSchema({
        bank_name: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Bank name is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Bank name is not valid',
          },
        },

        bank_account: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Bank account is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Bank account is not valid',
          },
        },

        branch: {
          in: ['body'],
          trim: true,
          custom: {
            options: (value: any) => {
              if (value === null) {
                return true;
              }
              return typeof value === 'string';
            },
            errorMessage: 'Branch is not valid.',
          },
        },
      }),
    ),
  ];
}
