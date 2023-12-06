import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DatabaseDefaultValues, PostgresDataType } from '~/constants/database_constants';
import Address from '../typing/address';
import { LoanReasonTypes, PostStatus } from '~/constants/enum';
import { User } from './User';

export interface IPost {
  id: string;
  user_id: string;
  type: string;
  loan_reason_type: LoanReasonTypes | null;
  loan_reason: string | null;
  status: PostStatus;
  title: string;
  description: string;
  images: string[];
  created_at: Date;
  updated_at: Date;
  interest_rate: number;
  loan_amount: number;
  tenure_months: number;
  overdue_interest_rate: number;
  max_interest_rate: number | null;
  max_loan_amount: number | null;
  max_tenure_months: number | null;
  max_overdue_interest_rate: number | null;
  rejected_reason: string | null;
  deleted_at: Date | null;
}

@Entity('posts')
class Post extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: PostgresDataType.uuid })
  user_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, enum: Object.values(LoanReasonTypes), nullable: true })
  loan_reason_type!: LoanReasonTypes | null;

  @Column({ type: PostgresDataType.varchar, length: 255, nullable: true })
  loan_reason!: string | null;

  @Column({ type: PostgresDataType.varchar, length: 50, enum: Object.values(PostStatus), default: PostStatus.pending })
  status!: PostStatus;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  title!: string;

  @Column({ type: PostgresDataType.varchar, length: 1000 })
  description!: string;

  @Column({ type: PostgresDataType.text, array: true })
  images!: string[];

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @UpdateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  updated_at!: Date;

  @Column({ type: PostgresDataType.double_precision })
  interest_rate!: number;

  @Column({ type: PostgresDataType.bigint })
  loan_amount!: number;

  @Column({ type: PostgresDataType.integer })
  tenure_months!: number;

  @Column({ type: PostgresDataType.double_precision })
  overdue_interest_rate!: number;

  @Column({ type: PostgresDataType.double_precision, nullable: true })
  max_interest_rate!: number | null;

  @Column({ type: PostgresDataType.bigint, nullable: true })
  max_loan_amount!: number | null;

  @Column({ type: PostgresDataType.integer, nullable: true })
  max_tenure_months!: number | null;

  @Column({ type: PostgresDataType.double_precision, nullable: true })
  max_overdue_interest_rate!: number | null;

  @Column({ type: PostgresDataType.varchar, length: 255, nullable: true })
  rejected_reason!: string | null;

  @DeleteDateColumn({ type: PostgresDataType.timestamp_without_timezone, nullable: true })
  deleted_at!: Date | null;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

export default Post;
