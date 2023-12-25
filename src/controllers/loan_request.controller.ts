import { Service } from 'typedi';
import LoanContractRequestService from '~/services/request.service';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import LoanRequestCreateData from '~/models/typing/request/RequestCreateData';
import StringUisUUID from '~/utils/StringUtils';
import { ParamsDictionary } from 'express-serve-static-core';
import ServerCodes from '~/constants/server_codes';
@Service()
class LoanContractRequestController {
  constructor(private loanContractRequestService: LoanContractRequestService) {}
  createLoanContractRequest = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, LoanRequestCreateData>, res: Response) => {
      const data: LoanRequestCreateData = {
        sender_id: req.user.id,
        receiver_id: req.body.receiver_id,
        loan_amount: req.body.loan_amount,
        interest_rate: req.body.interest_rate,
        overdue_interest_rate: req.body.overdue_interest_rate,
        loan_tenure_months: req.body.loan_tenure_months,
        loan_reason_type: req.body.loan_reason_type,
        loan_reason: req.body.loan_reason,
        video_confirmation: req.body.video_confirmation,
        portait_photo: req.body.portait_photo,
        id_card_front_photo: req.body.id_card_front_photo,
        id_card_back_photo: req.body.id_card_back_photo,
        description: req.body.description,
      };
      const result = await this.loanContractRequestService.createLoanContractRequest(data);
      res.status(200).json({
        status: 'success',
        code: ServerCodes.CommomCode.Success,
        message: 'Create loan contract request successfully',
        result,
      });
    },
  );

  getLoanContractRequestById = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const utils = new StringUisUUID();
    if (utils.isUUID(id) === false) {
      next();
    }
    const result = await this.loanContractRequestService.getLoanContractRequestById(id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get loan contract request by id successfully',
      result,
    });
  });

  getLoanContractRequestsByQuery = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = this.loanContractRequestService.buildLoanContractRequestQuery(req.query);
    query.user_id = req.user.id;
    const { data, number_of_pages } = await this.loanContractRequestService.getLoanContractRequestsByQuery(query);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get loan contract requests by query successfully',
      num_of_pages: number_of_pages,
      result: data,
    });
  });
  lenderAcceptLoanContractRequest = wrapRequestHandler(async (req: Request, res: Response) => {
    await this.loanContractRequestService.acceptLoanContractRequest(
      req.params.id,
      req.user.id,
      req.body.lender_bank_account_id,
    );
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Lender accept loan contract request successfully',
    });
  });

  lenderPayLoanContractRequest = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await this.loanContractRequestService.payLoanContractRequest(id, req.user.id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Lender pay loan contract request successfully',
      result: transaction,
    });
  });

  rejectLoanContractRequest = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.loanContractRequestService.rejectLoanContractRequest(id, req.user.id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Reject loan contract request successfully',
    });
  });

  cancelLoanContractRequest = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.loanContractRequestService.cancelLoanContractRequest(id, req.user.id);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Cancel loan contract request successfully',
    });
  });
}

export default LoanContractRequestController;
