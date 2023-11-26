import { Service } from "typedi";
import ContractTemplateService from "~/services/contract_template.service";
import { wrapRequestHandler } from "~/utils/wrapRequestHandler";
import { Request, Response } from "express";
import { buildBaseQuery } from "~/utils/build_query";
@Service()
class ContractTemplateController {
    private contractTemplateService: ContractTemplateService;
    constructor(contractTemplateService: ContractTemplateService) {
        this.contractTemplateService = contractTemplateService;
    }

    createContractTemplate = wrapRequestHandler(async (req: Request, res: Response) => {
        const data = req.body;
        const result = await this.contractTemplateService.createContractTemplate(data);
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Create contract template successfully',
            result,
        });
    });

    getContractTemplateById = wrapRequestHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.contractTemplateService.getContractTemplateById(id);
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Get contract template by id successfully',
            result,
        });
    });

    getContractTemplates = wrapRequestHandler(async (req: Request, res: Response) => {
        const query = buildBaseQuery(req.query);
        const result = await this.contractTemplateService.getContractTemplates(query);
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Get contract templates successfully',
            result,
        });
    });
}
export default ContractTemplateController;