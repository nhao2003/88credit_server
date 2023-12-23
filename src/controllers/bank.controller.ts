import { Service } from 'typedi';
import ServerCodes from '~/constants/server_codes';
import Bank from '~/models/databases/Bank';
import AppResponse from '~/models/typing/AppRespone';
import BankService from '~/services/bank.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class BankController {
  private bankService: BankService;
  constructor(bankService: BankService) {
    this.bankService = bankService;
  }

  public readonly getAllBank = wrapRequestHandler(async (req, res) => {
    // const result = await this.bankService.getAll();

    const result = (await this.bankService.getAllBank()) as Bank[];
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all bank successfully',
      result,
    };
    res.status(200).json(appResponse);
  });

  public readonly getBankById = wrapRequestHandler(async (req, res) => {
    const { id } = req.params;
    const result = (await this.bankService.getById(id)) as Bank;
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get bank by id successfully',
      result,
    };
    res.status(200).json(appResponse);
  });
}

export default BankController;
