import { checkSchema } from 'express-validator';
import { Service } from 'typedi';
import { LoanReasonTypes } from '~/constants/enum';
import { validate } from '~/utils/validation';

@Service()
export class RequestValidation {
  public createRequest = [
    validate(
      checkSchema({
        sender_id: {
          in: ['body'],
          isUUID: {
            errorMessage: 'Sender id is not valid',
          },
          notEmpty: {
            errorMessage: 'Sender id is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Sender id is not valid',
          },
        },
        receiver_id: {
          in: ['body'],
          isUUID: {
            errorMessage: 'Receiver id is not valid',
          },
          notEmpty: {
            errorMessage: 'Receiver id is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Receiver id is not valid',
          },
        },
        loan_amount: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Loan amount is required',
          },
          trim: true,
          isNumeric: {
            errorMessage: 'Loan amount is not valid',
          },
        },
        interest_rate: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Interest rate is required',
          },
          trim: true,
          isNumeric: {
            errorMessage: 'Interest rate is not valid',
          },
        },
        overdue_interest_rate: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Overdue interest rate is required',
          },
          trim: true,
          isNumeric: {
            errorMessage: 'Overdue interest rate is not valid',
          },
        },

        loan_tenure_months: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Loan tenure months is required',
          },
          trim: true,
          isNumeric: {
            errorMessage: 'Loan tenure months is not valid',
          },
        },

        loan_reason_type: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Loan reason type is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Loan reason type is not valid',
          },
          custom: {
            options: (value: any) => {
              return Object.values(LoanReasonTypes).includes(value);
            },
            errorMessage: 'Loan reason type is not valid.',
          },
        },

        loan_reason: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Reason for loan is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Reason for loan is not valid',
          },
          isLength: {
            errorMessage: 'Reason for loan must be at least 1 characters and less than 255 characters',
            options: { min: 1, max: 255 },
          },
        },

        video_comfirmation: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Video confirmation is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Video confirmation is not valid',
          },
          isURL: {
            errorMessage: 'Video confirmation is not valid',
          },
        },

        portait_photo: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Portrait photo is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Portrait photo is not valid',
          },
          isURL: {
            errorMessage: 'Portrait photo is not valid',
          },
        },

        id_card_front_photo: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'ID card front photo is required',
          },
          trim: true,
          isString: {
            errorMessage: 'ID card front photo is not valid',
          },
          isURL: {
            errorMessage: 'ID card front photo is not valid',
          },
        },

        id_card_back_photo: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'ID card back photo is required',
          },
          trim: true,
          isString: {
            errorMessage: 'ID card back photo is not valid',
          },
          isURL: {
            errorMessage: 'ID card back photo is not valid',
          },
        },
        sender_bank_account_id: {
          in: ['body'],
          isUUID: {
            errorMessage: 'Sender bank account id is not valid',
          },
          notEmpty: {
            errorMessage: 'Sender bank account id is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Sender bank account id is not valid',
          },
        },
      }),
    ),
  ];
}
