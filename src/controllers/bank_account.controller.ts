import { type } from 'os';
import { Service } from 'typedi';
import BankAccountService from '~/services/bank_account.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
type BankAccountCreateData = {
  user_id: string;
  bank_name: string;
  bank_account: string;
  branch: string | null;
};

@Service()
class BankAccountController {
  private bankAccountService: BankAccountService;
  constructor(bankAccountService: BankAccountService) {
    this.bankAccountService = bankAccountService;
  }

  createBankAccount = wrapRequestHandler(async (req: Request, res: Response) => {
    const data: BankAccountCreateData = {
      user_id: req.user.id,
      bank_name: req.body.bank_name,
      bank_account: req.body.bank_account,
      branch: req.body.branch,
    };
    const result = await this.bankAccountService.addBankAccount(data);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Create bank account successfully',
      result,
    });
  });

  getAllBankAccount = wrapRequestHandler(async (req: Request, res: Response) => {
    const result = await this.bankAccountService.getAllBankAccount(req.user.id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Get all bank account successfully',
      result,
    });
  });

  getBankAccountById = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.bankAccountService.getBankAccountById(id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Get bank account by id successfully',
      result,
    });
  });

  deleteBankAccount = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.bankAccountService.deleteBankAccount(id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Delete bank account successfully',
    });
  });

  markAsPrimaryBankAccount = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.bankAccountService.updateBankAccount(req.user.id, id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Update bank account successfully',
    });
  });

  getPrimaryBankAccount = wrapRequestHandler(async (req: Request, res: Response) => {
    const result = await this.bankAccountService.getPrimaryBankAccount(req.user.id);
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Get primary bank account successfully',
      result,
    });
  });
}

export default BankAccountController;
