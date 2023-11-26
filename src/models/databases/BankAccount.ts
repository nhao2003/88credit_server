import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import { User } from './User';
import Contract from './Contract';
import LoanRequest from './LoanRequest';

interface IBankAccount {
  id: string;
  is_primary: boolean;
  user_id: string;
  bank_name: string;
  bank_account: string;
  branch: string | null;
  created_at: Date;
  deleted_at: Date | null;
}

@Entity('bank_accounts')
class BankAccount extends BaseEntity implements IBankAccount {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.boolean, { default: false })
  is_primary!: boolean;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.varchar, { length: 50 })
  bank_name!: string;

  @Column(PostgresDataType.varchar, { length: 50, unique: true })
  bank_account!: string;

  @Column(PostgresDataType.varchar, { length: 50, nullable: true })
  branch!: string | null;

  @CreateDateColumn({type: PostgresDataType.timestamp_without_timezone})
  created_at!: Date;

  @DeleteDateColumn({type: PostgresDataType.timestamp_without_timezone})
  deleted_at!: Date | null;

  @ManyToOne(() => User, (user) => user.bank_accounts)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Contract, (contract) => contract.lender_bank_account)
  @JoinColumn({ name: 'id', referencedColumnName: 'lender_bank_account_id' })
  lend_contracts!: Contract[];

  @OneToMany(() => Contract, (contract) => contract.borrower_bank_account)
  @JoinColumn({ name: 'id', referencedColumnName: 'borrower_bank_account_id' })
  borrow_contracts!: Contract[];

  @OneToMany(() => LoanRequest, (loan_request) => loan_request.sender_bank_account)
  @JoinColumn({ name: 'id', referencedColumnName: 'sender_bank_account_id' })
  loan_requests_sent!: LoanRequest[];

  @OneToMany(() => LoanRequest, (loan_request) => loan_request.receiver_bank_account)
  @JoinColumn({ name: 'id', referencedColumnName: 'receiver_bank_account_id' })
  loan_requests_received!: LoanRequest[];
}

export default BankAccount;
