import Address from '../typing/address';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostgresDataType, DatabaseDefaultValues } from '~/constants/database_constants';
import { Role, UserStatus } from '~/constants/enum';
import { OTP } from './Otp';
import { Session } from './Sesstion';
import Post from './Post';
import LoanRequest from './LoanRequest';
import Contract from './Contract';
import BankAccount from './BankAccount';
import Relative from './Relative';
import Transaction from './Transaction';
import Report from './Report';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, default: UserStatus.unverified, enum: UserStatus })
  status!: string;

  @Column({ type: PostgresDataType.boolean, default: false })
  is_identity_verified!: boolean;

  @Column({ type: PostgresDataType.varchar, default: Role.user })
  role!: string;

  @Column({ type: PostgresDataType.varchar, length: 255, unique: true })
  email!: string;

  @Column({ type: PostgresDataType.varchar, length: 255, select: false })
  password!: string;

  @Column(PostgresDataType.jsonb, { nullable: true })
  address!: Address;

  @Column({ type: PostgresDataType.varchar, length: 50, default: '' })
  first_name!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, default: '' })
  last_name!: string;

  @Column({ type: PostgresDataType.boolean, default: 'false' })
  gender!: boolean;

  @Column({ type: PostgresDataType.text, nullable: true })
  avatar!: string;

  @Column({ type: PostgresDataType.date, nullable: true })
  dob!: Date;

  @Column({ type: PostgresDataType.varchar, default: '', unique: true })
  phone!: string;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  last_active_at!: Date;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  updated_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  banned_util!: Date | null;

  @Column(PostgresDataType.text, { nullable: true })
  ban_reason!: string | null;

  @OneToMany(() => OTP, (otp) => otp.user)
  @JoinColumn({ name: 'id' })
  otps!: OTP[];

  @OneToMany(() => Session, (session) => session.user)
  @JoinColumn({ name: 'id' })
  sessions!: Session[];

  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'id' })
  posts!: Post[];

  @OneToMany(() => LoanRequest, (LoanRequest) => LoanRequest.sender)
  @JoinColumn({ name: 'id' })
  loan_requests_sent!: LoanRequest[];

  @OneToMany(() => LoanRequest, (LoanRequest) => LoanRequest.receiver)
  @JoinColumn({ name: 'id' })
  loan_requests_received!: LoanRequest[];

  @OneToMany(() => Contract, (contract) => contract.lender)
  @JoinColumn({ name: 'id' })
  contracts_lender!: Contract[];

  @OneToMany(() => Contract, (contract) => contract.borrower)
  @JoinColumn({ name: 'id' })
  contracts_borrower!: Contract[];

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.user)
  @JoinColumn({ name: 'id' })
  bank_accounts!: BankAccount[];

  @OneToMany(() => Relative, (relative) => relative.user)
  @JoinColumn({ name: 'id' })
  relatives!: Relative[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  @JoinColumn({ name: 'id' })
  transactions!: Transaction[];

  @OneToMany(() => Report, (report) => report.reporter)
  @JoinColumn({ name: 'id' })
  reports!: Report[];
}
