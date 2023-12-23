import { checkSchema } from 'express-validator';
import { Service } from 'typedi';
import { validate } from '~/utils/validation';
@Service()
export class BankValidate {
  public addBankCard = [
    validate(
      checkSchema({
        bank_id: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Bank id is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Bank id is not valid',
          },
          isUUID: {
            errorMessage: 'Bank id is not valid',
          },
        },

        card_number: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Card number is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Card number is a string',
          },
          custom: {
            errorMessage: 'Card number is not valid',
            options: (value: any) => {
              // Card number must be a string number
              const regex = /^\d+$/;
              if (!regex.test(value)) {
                return false;
              }
              return 16 <= value.length && value.length <= 19;
            },
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
