import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import { PaymentMethods, TransactionStatus } from '~/constants/enum';
import { User } from './User';
interface ITransaction {
  id: string;
  id_third_party: string | null;
  status: TransactionStatus;
  title: string;
  description: string | null;
  user_id: string;
  amount: number;
  payment_method: PaymentMethods;
  items: Record<string, any>;
  embed_data: Record<string, any>;
  created_at: Date;
  transaction_at: Date | null;
  deleted_at: Date | null;
}

@Entity('transactions')
class Transaction implements ITransaction {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.varchar)
  id_third_party!: string | null;

  @Column(PostgresDataType.varchar, { length: 50, default: TransactionStatus.pending })
  status!: TransactionStatus;

  @Column(PostgresDataType.varchar, { length: 250 })
  title!: string;

  @Column(PostgresDataType.varchar, { length: 250, nullable: true })
  description!: string | null;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.bigint)
  amount!: number;

  @Column(PostgresDataType.varchar)
  payment_method!: PaymentMethods;

  @Column(PostgresDataType.jsonb)
  items!: Record<string, any>;

  @Column(PostgresDataType.jsonb)
  embed_data!: Record<string, any>;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  transaction_at!: Date | null;

  @DeleteDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  deleted_at!: Date | null;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

export default Transaction;
