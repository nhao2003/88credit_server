import express from 'express';
import ContractController from '~/controllers/contract.controller';
import DependencyInjection from '~/di/di';
import CommonValidation from '~/middlewares/common.middlewares';

const router = express.Router();
const contractController = DependencyInjection.get<ContractController>(ContractController);
const commonValidation = DependencyInjection.get<CommonValidation>(CommonValidation);
router.get('/:id', commonValidation.validateId, contractController.getContractById);
router.get('/', contractController.getContracts);
router.post('/verify-zalopay-payment', contractController.verifyZaloPayPaymentAndCreateContract);
export default router;
