import { Service } from 'typedi';
import ServerCodes from '~/constants/server_codes';
import Bank from '~/models/databases/Bank';
import AppResponse from '~/models/typing/AppRespone';
import BankService from '~/services/bank.service';
import { buildBaseQuery } from '~/utils/build_query';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class BankController {
  private bankService: BankService;
  constructor(bankService: BankService) {
    this.bankService = bankService;
  }

  private banks: Bank[] = [];

  public readonly getAllBank = wrapRequestHandler(async (req, res) => {
    // const result = await this.bankService.getAll();
    if (this.banks.length === 0) {
      this.banks = (await this.bankService.getAll()) as Bank[];
    }
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all bank successfully',
      result: this.banks,
    };
    res.status(200).json(appResponse);
  });
}

export default BankController;
