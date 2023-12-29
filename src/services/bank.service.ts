import { Service } from 'typedi';
import Bank, { IBank } from '~/models/databases/Bank';
import { DataSource, Repository } from 'typeorm';
import BankCard, { IBankCard } from '~/models/databases/BankCard';
import { AppError } from '~/models/Error';
import ServerCodes from '~/constants/server_codes';

@Service()
class BankService {
  private bankCardRepository: Repository<BankCard>;
  private bankRepository: Repository<Bank>;
  constructor(dataSource: DataSource) {
    this.bankCardRepository = dataSource.getRepository(BankCard);
    this.bankRepository = dataSource.getRepository(Bank);
  }
  private banks: Bank[] = [];

  public getAllBank = async () => {
    if (this.banks.length === 0) {
      this.banks = await this.bankRepository.find();
    }
    return this.banks;
  };

  public getById = async (id: string) => {
    // return await this.bankRepository.findOne({ where: { id: id } });
    let bank: Bank | null | undefined = this.banks.find((b) => b.id === id);
    if (bank === undefined || bank === null) {
      console.log('Get bank from database');
      bank = await this.bankRepository.findOne({ where: { id: id } });
    } else {
      console.log('Get bank from cache');
    }
    return bank;
  };

  public checkValidAccount = async (
    bank_id: string,
    card_number: string,
  ): Promise<{ status: boolean; message: string }> => {
    let bank;
    try {
      bank = await this.getById(bank_id);
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Invalid bank id',
      };
    }
    if (bank === undefined || bank === null) {
      return {
        status: false,
        message: 'Bank not found',
      };
    }
    // return bank_account.startsWith(bank.bin);
    const validAccountNumber = card_number.startsWith(bank.bin);
    if (!validAccountNumber) {
      return {
        status: false,
        message: 'Invalid bank account number',
      };
    }
    return {
      status: true,
      message: 'Valid bank account number',
    };
  };

  public addBankCard = async (data: Partial<IBankCard>) => {
    const validAccountNumber = await this.checkValidAccount(data.bank_id ?? '', data.card_number ?? '');
    if (!validAccountNumber.status) {
      throw AppError.badRequest(ServerCodes.BankCode.AddBankAccountFailed, validAccountNumber.message);
    }
    const bankAccount = new BankCard();
    const oldBank = await this.bankCardRepository.findOne({ where: { user_id: data.user_id } });
    bankAccount.card_number = data.card_number as string;
    bankAccount.bank_id = data.bank_id!;
    bankAccount.is_primary = oldBank === undefined || oldBank === null ? true : oldBank.is_primary;
    bankAccount.user_id = data.user_id as string;
    bankAccount.branch = data.branch ?? null;
    bankAccount.deleted_at = null;
    // return await this.bankAcountRepository.upsert(bankAccount, {
    //   conflictPaths: ['bank_account'],
    // });
    await this.bankCardRepository.upsert(bankAccount, {
      conflictPaths: ['card_number'],
    });
    return bankAccount;
  };

  public getAllBankCard = async (user_id: string) => {
    return await this.bankCardRepository.find({ where: { user_id: user_id } });
  };

  public getBankCardById = async (id: string) => {
    return await this.bankCardRepository.findOne({ where: { id: id } });
  };

  public deleteBankCard = async (id: string) => {
    const bankAccount = await this.bankCardRepository.findOne({ where: { id: id } });
    if (bankAccount === undefined || bankAccount === null) {
      throw AppError.notFound();
    }
    await this.bankCardRepository.softDelete(id);
  };

  public updateBankAccount = async (user_id: string, bank_account_id: string) => {
    const bankAccount = await this.bankCardRepository.findOne({ where: { id: bank_account_id, user_id } });
    if (bankAccount === undefined || bankAccount === null) {
      throw AppError.notFound();
    }
    await Promise.all([
      this.bankCardRepository.update({ user_id }, { is_primary: false }),
      this.bankCardRepository.update({ id: bank_account_id }, { is_primary: true }),
    ]);
  };

  public getPrimaryBankCard = async (user_id: string) => {
    return await this.bankCardRepository.findOne({ where: { user_id, is_primary: true } });
  };
}

export default BankService;
