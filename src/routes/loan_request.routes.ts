import { Router } from 'express';
import LoanContractRequestController from '~/controllers/loan_request.controller';
import DependencyInjection from '~/di/di';
import AuthValidation from '~/middlewares/auth.middleware';
import CommonValidation from '~/middlewares/common.middlewares';
import { RequestValidation } from '~/middlewares/request.middleware';
const loanContractRequestController =
  DependencyInjection.get<LoanContractRequestController>(LoanContractRequestController);
const commonValidation = DependencyInjection.get<CommonValidation>(CommonValidation);
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);

const requestValidation = DependencyInjection.get<RequestValidation>(RequestValidation);
const routes = Router();
routes.use(authValidation.accessTokenValidation);
routes.route('/').get(loanContractRequestController.getLoanContractRequestsByQuery);
routes
  .route('/create')
  .post(
    authValidation.accessTokenValidation,
    requestValidation.createRequest,
    loanContractRequestController.createLoanContractRequest,
  );
routes.route('/:id').get(loanContractRequestController.getLoanContractRequestById);
routes
  .route('/lender-accept/:id')
  .patch(commonValidation.validateId, loanContractRequestController.lenderAcceptLoanContractRequest);
routes
  .route('/lender-pay/:id')
  .patch(commonValidation.validateId, loanContractRequestController.lenderPayLoanContractRequest);
routes
  .route('/reject-request/:id')
  .patch(commonValidation.validateId, loanContractRequestController.rejectLoanContractRequest);
routes
  .route('/cancle-request/:id')
  .patch(commonValidation.validateId, loanContractRequestController.cancelLoanContractRequest);
export default routes;
