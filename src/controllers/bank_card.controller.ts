import { Service } from 'typedi';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
import ServerCodes from '~/constants/server_codes';
import BankService from '~/services/bank.service';
type BankCardCreateData = {
  user_id: string;
  bank_id: string;
  card_number: string;
  branch: string | null;
};

@Service()
class BankAccountController {
  private bankService: BankService;
  constructor(bankService: BankService) {
    this.bankService = bankService;
  }

  addBankCard = wrapRequestHandler(async (req: Request, res: Response) => {
    const data: BankCardCreateData = {
      user_id: req.user.id,
      bank_id: req.body.bank_id,
      card_number: req.body.card_number,
      branch: req.body.branch,
    };
    const result = await this.bankService.addBankCard(data);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Create bank account successfully',
      result,
    });
  });

  getAllBankAccount = wrapRequestHandler(async (req: Request, res: Response) => {
    const result = await this.bankService.getAllBankCard(req.user.id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all bank account successfully',
      result,
    });
  });

  getBankCardById = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.bankService.getBankCardById(id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get bank account by id successfully',
      result,
    });
  });

  deleteBankCard = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.bankService.deleteBankCard(id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Delete bank account successfully',
    });
  });

  markAsPrimaryBankCard = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.bankService.updateBankAccount(req.user.id, id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Update bank account successfully',
    });
  });

  getPrimaryBankCard = wrapRequestHandler(async (req: Request, res: Response) => {
    const result = await this.bankService.getPrimaryBankCard(req.user.id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get primary bank account successfully',
      result,
    });
  });
}

export default BankAccountController;
