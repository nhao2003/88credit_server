import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import { User } from './User';
import Contract from './Contract';
import LoanRequest from './LoanRequest';
import Bank from './Bank';

export interface IBankCard {
  id: string;
  is_primary: boolean;
  user_id: string;
  bank_id: string;
  card_number: string;
  branch: string | null;
  created_at: Date;
  deleted_at: Date | null;

  bank: Bank;
}

@Entity('bank_cards')
class BankCard extends BaseEntity implements IBankCard {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.boolean, { default: false })
  is_primary!: boolean;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.uuid)
  bank_id!: string;

  @Column(PostgresDataType.varchar, { length: 50, unique: true })
  card_number!: string;

  @Column(PostgresDataType.varchar, { length: 50, nullable: true })
  branch!: string | null;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_at!: Date;

  @DeleteDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  deleted_at!: Date | null;

  @ManyToOne(() => User, (user) => user.bank_cards)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Contract, (contract) => contract.lender_bank_card)
  @JoinColumn({ name: 'id', referencedColumnName: 'lender_bank_card_id' })
  lend_contracts!: Contract[];

  @OneToMany(() => Contract, (contract) => contract.borrower_bank_card)
  @JoinColumn({ name: 'id', referencedColumnName: 'borrower_bank_card_id' })
  borrow_contracts!: Contract[];

  @OneToMany(() => LoanRequest, (loan_request) => loan_request.sender_bank_card)
  @JoinColumn({ name: 'id', referencedColumnName: 'sender_bank_card_id' })
  loan_requests_sent!: LoanRequest[];

  @OneToMany(() => LoanRequest, (loan_request) => loan_request.receiver_bank_card)
  @JoinColumn({ name: 'id', referencedColumnName: 'receiver_bank_card_id' })
  loan_requests_received!: LoanRequest[];

  @ManyToOne(() => Bank, (bank) => bank.bank_cards)
  @JoinColumn({ name: 'bank_id', referencedColumnName: 'id' })
  bank!: Bank;
}

export default BankCard;
