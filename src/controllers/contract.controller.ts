import { Service } from 'typedi';
import ContractService from '~/services/contract.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
import { buildBaseQuery } from '~/utils/build_query';
import ContractTemplateService from '~/services/contract_template.service';
import ServerCodes from '~/constants/server_codes';

@Service()
class ContractController {
  private contractService: ContractService;
  private contractTemplateService: ContractTemplateService;
  constructor(contractService: ContractService, contractTemplateService: ContractTemplateService) {
    this.contractService = contractService;
    this.contractTemplateService = contractTemplateService;
  }

  getContractById = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.contractService.getContractById(id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get contract by id successfully',
      result,
    });
  });

  getContracts = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = await this.contractService.buildContractRequestQuery(req.query);
    const { number_of_pages, data } = await this.contractService.getLoanContractRequestsByQuery(query);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get contracts successfully',
      num_of_pages: number_of_pages,
      result: data,
    });
  });

  verifyZaloPayPaymentAndCreateContract = wrapRequestHandler(async (req: Request, res: Response) => {
    const { type, mac, data } = req.body;
    const result = await this.contractService.verifyZaloPayPaymentAndCreateContract(type, mac, data);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Verify ZaloPay payment and create contract successfully',
      result,
    });
  });
}
export default ContractController;
