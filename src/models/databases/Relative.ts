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
import Address from '../typing/address';
import { PostgresDataType } from '~/constants/database_constants';
import { User } from './User';

enum Relationship {
  Father = 'father',
  Mother = 'mother',
  Brother = 'brother',
  Sister = 'sister',
  Son = 'son',
  Daughter = 'daughter',
  Husband = 'husband',
  Wife = 'wife',
  Grandfather = 'grandfather',
  Grandmother = 'grandmother',
  Grandson = 'grandson',
  Granddaughter = 'granddaughter',
  Uncle = 'uncle',
  Aunt = 'aunt',
  Nephew = 'nephew',
  Niece = 'niece',
  Cousin = 'cousin',
  Friend = 'friend',
  Other = 'other',
}

interface IRelative {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  relationship: Relationship;
  address: Address;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

@Entity('relatives')
class Relative extends BaseEntity implements IRelative {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: PostgresDataType.uuid })
  user_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  name!: string;

  @Column({ type: PostgresDataType.varchar, length: 20 })
  phone_number!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  relationship!: Relationship;

  @Column({ type: PostgresDataType.jsonb })
  address!: Address;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_at!: Date;

  @UpdateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  updated_at!: Date | null;

  @DeleteDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  deleted_at!: Date | null;

  @ManyToOne(() => User, (user) => user.relatives)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  
}

export default Relative;
