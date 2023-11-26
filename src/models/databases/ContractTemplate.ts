import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';

export interface IContractTemplate {
  id: string;
  template_name: string;
  content: string;
  is_active: boolean;
  deleted_at: Date | null;
  created_at: Date;
}

@Entity('contract_templates')
export class ContractTemplate extends BaseEntity implements IContractTemplate {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.text)
  template_name!: string;

  @Column(PostgresDataType.text)
  content!: string;

  @Column(PostgresDataType.boolean)
  is_active!: boolean;

  @DeleteDateColumn()
  deleted_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;
}

export default ContractTemplate;
