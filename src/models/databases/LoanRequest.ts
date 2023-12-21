import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import { LoanContractRequestStatus } from '~/constants/enum';
import { User } from './User';
import BankAccount from './BankAccount';

interface LoanRequestInterface {
  id: string;
  status: LoanContractRequestStatus;
  sender_id: string;
  receiver_id: string;
  description: string;
  loan_amount: number;
  interest_rate: number;
  overdue_interest_rate: number;
  loan_tenure_months: number;
  loan_reason_type: string;
  loan_reason: string;
  video_comfirmation: string;
  portait_photo: string;
  id_card_front_photo: string;
  id_card_back_photo: string;
  sender_bank_account_id: string;
  receiver_bank_account_id: string;
  rejected_reason: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

@Entity('loan_requests')
class LoanRequest extends BaseEntity implements LoanRequestInterface {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, default: LoanContractRequestStatus.pending })
  status!: LoanContractRequestStatus;

  @Column({ type: PostgresDataType.uuid })
  sender_id!: string;

  @Column({ type: PostgresDataType.uuid })
  receiver_id!: string;

  @Column({ type: PostgresDataType.varchar })
  description!: string;

  @Column({ type: PostgresDataType.bigint })
  loan_amount!: number;

  @Column({ type: PostgresDataType.double_precision })
  interest_rate!: number;

  @Column({ type: PostgresDataType.double_precision })
  overdue_interest_rate!: number;

  @Column({ type: PostgresDataType.integer })
  loan_tenure_months!: number;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  loan_reason_type!: string;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  loan_reason!: string;

  @Column({ type: PostgresDataType.text })
  video_comfirmation!: string;

  @Column({ type: PostgresDataType.text })
  portait_photo!: string;

  @Column({ type: PostgresDataType.text })
  id_card_front_photo!: string;

  @Column({ type: PostgresDataType.text })
  id_card_back_photo!: string;

  @Column({ type: PostgresDataType.uuid })
  sender_bank_account_id!: string;

  @Column({ type: PostgresDataType.uuid, nullable: true })
  receiver_bank_account_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 255, nullable: true })
  rejected_reason!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_at!: Date;

  @UpdateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  updated_at!: Date | null;

  @DeleteDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  deleted_at!: Date | null;

  @ManyToOne(() => User, (user) => user.loan_requests_sent)
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  @ManyToOne(() => User, (user) => user.loan_requests_received)
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;

  @ManyToOne(() => BankAccount, (bank_account) => bank_account.loan_requests_sent)
  @JoinColumn({ name: 'sender_bank_account_id' })
  sender_bank_account!: BankAccount;

  @ManyToOne(() => BankAccount, (bank_account) => bank_account.loan_requests_received)
  @JoinColumn({ name: 'receiver_bank_account_id' })
  receiver_bank_account!: BankAccount;
}

export default LoanRequest;
