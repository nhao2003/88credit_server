import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import BankAccount from './BankAccount';
/**
 * Represents a bank.
 */
export interface IBank {
  /**
   * The unique identifier of the bank.
   * @type {number}
   */
  id: number;

  /**
   * The name of the bank.
   * @type {string}
   */
  name: string;

  /**
   * The code associated with the bank.
   * @type {string}
   */
  code: string;

  /**
   * The BIN (Bank Identification Number) of the bank.
   * @type {string}
   */
  bin: string;

  /**
   * The short name or abbreviation of the bank.
   * @type {string}
   */
  short_name: string;

  /**
   * The URL of the bank's logo.
   * @type {string}
   */
  logo: string;
}

@Entity('banks')
class Bank extends BaseEntity implements IBank {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: number;

  @Column(PostgresDataType.varchar, { length: 100 })
  name!: string;

  @Column(PostgresDataType.varchar, { length: 50 })
  code!: string;

  @Column(PostgresDataType.varchar, { length: 50 })
  bin!: string;

  @Column(PostgresDataType.varchar, { length: 50 })
  short_name!: string;

  @Column(PostgresDataType.text)
  logo!: string;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.bank)
  @JoinColumn({ name: 'id', referencedColumnName: 'bank_id' })
  bank_accounts!: BankAccount[];
}

export default Bank;
