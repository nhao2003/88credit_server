import { Router } from 'express';
import di from '../di/di';
import BankController from '~/controllers/bank.controller';
import CommonValidation from '~/middlewares/common.middlewares';

const commonValidation = di.get<CommonValidation>(CommonValidation);
const bankController = di.get<BankController>(BankController);
const route = Router();
route.get('/', bankController.getAllBank);
route.get('/:id', commonValidation.validateId, bankController.getBankById);
export default route;
