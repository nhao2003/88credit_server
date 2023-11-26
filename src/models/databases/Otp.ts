import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import { User } from './User';

@Entity('otps')
export class OTP extends BaseEntity {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  issued_at!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone })
  expiration_time!: Date;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  token!: string;

  @Column('uuid')
  user_id!: string;

  @Column({ type: PostgresDataType.boolean, default: 'false' })
  is_used!: boolean;

  @ManyToOne(() => User, user => user.otps)
  @JoinColumn({ name: 'user_id' })
  user!: User;
  
}
