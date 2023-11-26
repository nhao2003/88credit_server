import { checkSchema } from 'express-validator';
import { Service } from 'typedi';
import { ParamsValidation } from './validation/params_validation';
import { validate } from '../utils/validation';
import PostServices from '../services/post.service';
import { LoanReasonTypes, PostTypes } from '../constants/enum';

@Service()
export class PostValidation {
  constructor(private postServices: PostServices) {}
  public checkCreatePost = [
    validate(
      checkSchema({
        type: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Post type id is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Post type id is not valid',
          },
          custom: {
            options: (value: any) => {
              return Object.values(PostTypes).includes(value);
            },
            errorMessage: 'Post type is not valid.',
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
        title: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Title is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Title is not valid',
          },
          isLength: {
            errorMessage: 'Title must be at least 1 characters and less than 255 characters',
            options: { min: 1, max: 255 },
          },
        },
        description: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Description is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Description is not valid',
          },
          isLength: {
            errorMessage: 'Description must be at least 1 characters and less than 1500 characters',
            options: { min: 1, max: 1500 },
          },
        },
        images: {
          in: ['body'],
          trim: true,
          isArray: {
            errorMessage: 'Images is not valid',
          },
          custom: {
            options: (value: any) => {
              try {
                //Is array of string
                if (!Array.isArray(value)) return false;
                for (const image of value) {
                  if (typeof image !== 'string') return false;
                }
                return true;
              } catch (error) {
                return false;
              }
            },
            errorMessage: 'Images is not valid.',
          },
        },
        interest_rate: ParamsValidation.interest_rate,
        max_interest_rate: {
          custom: {
            options: (value: any, req: any) => {
              if (value === null || value === undefined) return true;
              if (typeof value !== 'number') return false;
              if (value < 0) return false;
              if (value > 1) return false;
              if (value < req.body.interest_rate) return false;
              if (value < req.body.interest_rate) return false;
              return true;
            },
            errorMessage: 'Max interest rate is not valid',
          },
        },

        loan_amount: ParamsValidation.loan_amount,
        max_loan_amount: {
          custom: {
            options: (value: any, req: any) => {
              if (value === null || value === undefined) return true;
              if (typeof value !== 'number') return false;
              if (value < 0) return false;
              if (value < req.body.loan_amount) return false;
              return true;
            },
            errorMessage: 'Max loan amount is not valid',
          },
        },
        tenure_months: ParamsValidation.loan_term,
        max_tenure_months: {
          custom: {
            options: (value: any, req: any) => {
              // If null, return true
              if (value === null || value === undefined) return true;
              // If not null, check
              if (typeof value !== 'number') return false;
              if (value < 0) return false;
              if (value < req.body.tenure_months) return false;
              return true;
            },
            errorMessage: 'Max tenure months is not valid',
          },
        },
        overdue_interest_rate: ParamsValidation.interest_rate,
        max_overdue_interest_rate: {
          custom: {
            options: (value: any, req: any) => {
              // If null, return true
              if (value === null || value === undefined) return true;
              // If not null, check
              if (typeof value !== 'number') return false;
              if (value < 0) return false;
              if (value > 1) return false;
              if (value < req.body.overdue_interest_rate) return false;
              return true;
            },
            errorMessage: 'Max overdue interest rate is not valid',
          },
        },
      }),
    ),
  ];
}
