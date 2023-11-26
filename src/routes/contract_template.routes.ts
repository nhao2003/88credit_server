import express from 'express';
import ContractTemplateController from '~/controllers/contract_template.controller';
import DependencyInjection from '~/di/di';
import CommonValidation from '~/middlewares/common.middlewares';

const router = express.Router();
const contractController = DependencyInjection.get<ContractTemplateController>(ContractTemplateController);
const commonValidation = DependencyInjection.get<CommonValidation>(CommonValidation);
router.get('/contract-templates/:id', commonValidation.validateId, contractController.getContractTemplateById);
router.get('/contract-templates', contractController.getContractTemplates);
router.post('/contract-templates', contractController.createContractTemplate);
export default router;
