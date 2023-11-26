import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { DatabaseDefaultValues, PostgresDataType } from '~/constants/database_constants';
import { User } from './User';

@Entity('sessions')
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  starting_date!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone })
  expiration_date!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  updated_at!: Date;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
