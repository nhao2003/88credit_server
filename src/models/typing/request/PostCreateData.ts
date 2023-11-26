// import {
//     BaseEntity,
//     Column,
//     CreateDateColumn,
//     Entity,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
//     DeleteDateColumn,
//     ManyToOne,
//     JoinColumn
//   } from 'typeorm';
//   import { DatabaseDefaultValues, PostgresDataType } from '~/constants/database_constants';
//   import Address from '../typing/address';
//   import { LoanReasonTypes } from '~/constants/enum';
//   import { User } from './user';

import { LoanReasonTypes } from '~/constants/enum';
import Address from '../address';
export interface PostCreateData {
    user_id: string;
    type: string;
    loan_reason_type: LoanReasonTypes | null;
    loan_reason: string | null;
    title: string;
    description: string;
    images: string[];
    interest_rate: number;
    loan_amount: number;
    tenure_months: number;
    overdue_interest_rate: number;
    max_interest_rate: number | null;
    max_loan_amount: number | null;
    max_tenure_months: number | null;
    max_overdue_interest_rate: number | null;
  }