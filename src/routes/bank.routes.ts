import { Router } from 'express';
import di from '../di/di';
import BankController from '~/controllers/bank.controller';
const bankController = di.get<BankController>(BankController);
const route = Router();
route.get('/', bankController.getAllBank);
export default route;
