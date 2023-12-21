import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { AppError } from '~/models/Error';
import BankAccount from '~/models/databases/BankAccount';

@Service()
class BankAccountService {
  private repository: Repository<BankAccount>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(BankAccount);
  }
  public addBankAccount = async (data: Record<string, any>) => {
    const bankAccount = new BankAccount();
    const count = await this.repository.count({ where: { user_id: data.user_id } });
    bankAccount.bank_account = data.bank_account;
    bankAccount.bank_name = data.bank_name;
    bankAccount.is_primary = count === 0;
    bankAccount.user_id = data.user_id;
    bankAccount.branch = data.branch;
    bankAccount.deleted_at = null;
    return await this.repository.upsert(bankAccount, {
      conflictPaths: ['bank_account'],
    });
  };

  public getAllBankAccount = async (user_id: string) => {
    return await this.repository.find({ where: { user_id: user_id } });
  };

  public getBankAccountById = async (id: string) => {
    return await this.repository.findOne({ where: { id: id } });
  };

  public deleteBankAccount = async (id: string) => {
    const bankAccount = await this.repository.findOne({ where: { id: id } });
    if (bankAccount === undefined || bankAccount === null) {
      throw AppError.notFound();
    }
    await this.repository.softDelete(id);
  };

  // Mark as primary
  public updateBankAccount = async (user_id: string, bank_account_id: string) => {
    const bankAccount = await this.repository.findOne({ where: { id: bank_account_id, user_id } });
    if (bankAccount === undefined || bankAccount === null) {
      throw AppError.notFound();
    }
    await Promise.all([
      this.repository.update({ user_id }, { is_primary: false }),
      this.repository.update({ id: bank_account_id }, { is_primary: true }),
    ]);
  };

  public getPrimaryBankAccount = async (user_id: string) => {
    return await this.repository.findOne({ where: { user_id, is_primary: true } });
  };
}

export default BankAccountService;