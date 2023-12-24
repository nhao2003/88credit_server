import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostgresDataType } from '~/constants/database_constants';
import BankCard from './BankCard';
/**
 * Represents a bank.
 */
export interface IBank {
  /**
   * The unique identifier of the bank.
   * @type {number}
   */
  id: string;

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
  id!: string;

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

  @OneToMany(() => BankCard, (bankcard) => bankcard.bank)
  @JoinColumn({ name: 'id', referencedColumnName: 'bank_id' })
  bank_cards!: BankCard[];
}

export default Bank;
