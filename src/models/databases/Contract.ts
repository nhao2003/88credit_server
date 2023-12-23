import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import ContractTemplate from './ContractTemplate';
import { User } from './User';
import BankCard from './BankCard';

interface IContract {
  id: string;
  loan_contract_request_id: string;
  contract_template_id: string;
  lender_id: string;
  lender_bank_account_id: string;
  borrower_id: string;
  borrower_bank_account_id: string;
  loan_reason_type: string;
  loan_reason: string;
  amount: number;
  interest_rate: number;
  tenure_in_months: number;
  overdue_interest_rate: number;
  created_at: Date;
  expired_at: Date;
}

@Entity('contracts')
export class Contract extends BaseEntity implements IContract {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.uuid)
  loan_contract_request_id!: string;

  @Column(PostgresDataType.uuid)
  contract_template_id!: string;

  @Column(PostgresDataType.uuid)
  lender_id!: string;

  @Column(PostgresDataType.uuid)
  lender_bank_account_id!: string;

  @Column(PostgresDataType.uuid)
  borrower_id!: string;

  @Column(PostgresDataType.uuid)
  borrower_bank_account_id!: string;

  @Column(PostgresDataType.varchar, { length: 50 })
  loan_reason_type!: string;

  @Column(PostgresDataType.text)
  loan_reason!: string;

  @Column(PostgresDataType.bigint)
  amount!: number;

  @Column(PostgresDataType.double_precision)
  interest_rate!: number;

  @Column(PostgresDataType.integer)
  tenure_in_months!: number;

  @Column(PostgresDataType.double_precision)
  overdue_interest_rate!: number;

  @Column(PostgresDataType.timestamp_without_timezone)
  created_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone)
  expired_at!: Date;

  @ManyToOne(() => ContractTemplate, (contract_template) => contract_template.id)
  @JoinColumn({ name: 'contract_template_id' })
  contract_template!: ContractTemplate;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'lender_id' })
  lender!: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'borrower_id' })
  borrower!: User;

  @ManyToOne(() => BankCard, (bank_account) => bank_account.lend_contracts)
  @JoinColumn({ name: 'lender_bank_account_id', referencedColumnName: 'id' })
  lender_bank_account!: BankCard;

  @ManyToOne(() => BankCard, (bank_account) => bank_account.borrow_contracts)
  @JoinColumn({ name: 'borrower_bank_account_id', referencedColumnName: 'id' })
  borrower_bank_account!: BankCard;
}

export default Contract;
