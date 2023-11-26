import { Service } from "typedi";
import ContractService from "~/services/contract.service";
import { wrapRequestHandler } from "~/utils/wrapRequestHandler";
import { Request, Response } from "express";
import { buildBaseQuery } from "~/utils/build_query";
import ContractTemplateService from "~/services/contract_template.service";

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
            code: 200,
            message: 'Get contract by id successfully',
            result,
        });
    });

    getContracts = wrapRequestHandler(async (req: Request, res: Response) => {
        const query = buildBaseQuery(req.query);
        const result = await this.contractService.getContracts(query);
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Get contracts successfully',
            result,
        });
    });

    verifyZaloPayPaymentAndCreateContract = wrapRequestHandler(async (req: Request, res: Response) => {
        const { type, mac, data } = req.body;
        const result = await this.contractService.verifyZaloPayPaymentAndCreateContract(type, mac, data);
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Verify ZaloPay payment and create contract successfully',
            result,
        });
    });


}
export default ContractController;