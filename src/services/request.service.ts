import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import {
  LoanContractRequestStatus,
  LoanContractRequestTypes,
  PaymentMethods,
  TransactionStatus,
} from '~/constants/enum';
import { AppError } from '~/models/Error';
import LoanRequest from '~/models/databases/LoanRequest';
import Transaction from '~/models/databases/Transaction';
import { LoanContractRequestQuery } from '~/models/typing/base_query';
import LoanRequestCreateData from '~/models/typing/request/RequestCreateData';
import { buildOrder, buildQuery } from '~/utils/build_query';
import ZaloPayService, { ZaloPayOrderRequest } from './zalopay.service';
import Contract from '~/models/databases/Contract';
import BankAccountService from './bank_account.service';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import { Server } from 'http';
import ServerCodes from '~/constants/server_codes';

type FindResult = {
  data: LoanRequest[];
  number_of_pages: number;
};
@Service()
class LoanContractRequestService {
  private loanContractRequestRepository: Repository<LoanRequest>;
  private transactionRepository: Repository<Transaction>;
  private zaloPayService: ZaloPayService;
  private bankAccountService: BankAccountService;
  constructor(dataSource: DataSource, zaloPayService: ZaloPayService) {
    this.loanContractRequestRepository = dataSource.getRepository(LoanRequest);
    this.transactionRepository = dataSource.getRepository(Transaction);
    this.zaloPayService = zaloPayService;
    this.bankAccountService = new BankAccountService(dataSource);
  }

  buildLoanContractRequestQuery(query: Record<string, any>): LoanContractRequestQuery {
    const { page, orders, search } = query;
    const pageParam = Number(page) || 1;
    const postQueries: {
      [key: string]: any;
    } = {};

    const lenderQueries: {
      [key: string]: any;
    } = {};

    const borrowerQueries: {
      [key: string]: any;
    } = {};

    Object.keys(query)
      .filter((key) => key.startsWith('request_'))
      .forEach((key) => {
        postQueries[key.replace('request_', '')] = query[key];
      });

    Object.keys(query)
      .filter((key) => key.startsWith('sender_'))
      .forEach((key) => {
        lenderQueries[key.replace('sender_', '')] = query[key];
      });

    Object.keys(query)
      .filter((key) => key.startsWith('receiver_'))
      .forEach((key) => {
        borrowerQueries[key.replace('receiver_', '')] = query[key];
      });

    const postWhere: string[] = buildQuery(postQueries);
    const lenderWhere: string[] = buildQuery(lenderQueries);
    const borrowerWhere: string[] = buildQuery(borrowerQueries);

    const order = buildOrder(orders as string, 'LoanRequest');

    return {
      page: pageParam,
      wheres: postWhere,
      lenderWhere,
      borrowerWhere,
      orders: order,
    };
  }

  async createLoanContractRequest(data: LoanRequestCreateData): Promise<void> {
    await this.loanContractRequestRepository.insert(data);
  }

  async getLoanContractRequestById(id: string): Promise<LoanRequest | null> {
    return await this.loanContractRequestRepository.findOne({ where: { id } });
  }

  async checkLoanContractRequestExistOrThrowError(id: string): Promise<LoanRequest> {
    const LoanRequest = await this.loanContractRequestRepository.findOne({ where: { id } });
    if (LoanRequest == null) {
      throw AppError.notFound();
    }
    return LoanRequest;
  }

  async checkLoanContractRequestExistByIdAndUserOrThrowError(id: string, user_id: string): Promise<LoanRequest> {
    const LoanRequest = await this.loanContractRequestRepository
      .createQueryBuilder()
      .where({
        id,
      })
      .andWhere('sender_id = :user_id OR receiver_id = :user_id', { user_id })
      .getOne();
    if (LoanRequest == null) {
      throw AppError.notFound();
    }
    return LoanRequest;
  }

  async getLoanContractRequestsByQuery(query: LoanContractRequestQuery): Promise<FindResult> {
    var { page, wheres, orders, lenderWhere, borrowerWhere } = query;
    var queryBuilder = this.loanContractRequestRepository
      .createQueryBuilder()
      .where({
        sender_id: query.user_id,
      })
      .leftJoinAndSelect('LoanRequest.sender', 'sender')
      .leftJoinAndSelect('LoanRequest.receiver', 'receiver');

    if (wheres != null && wheres.length > 0) {
      wheres.forEach((where: string) => {
        queryBuilder = queryBuilder.andWhere('LoanRequest.' + where);
      });
    }

    if (lenderWhere != null && lenderWhere.length > 0) {
      lenderWhere.forEach((where: string) => {
        queryBuilder = queryBuilder.andWhere('sender.' + where);
      });
    }

    if (borrowerWhere != null && borrowerWhere.length > 0) {
      borrowerWhere.forEach((where: string) => {
        queryBuilder = queryBuilder.andWhere('receiver.' + where);
      });
    }

    if (orders != null && orders.length > 0) {
      queryBuilder = queryBuilder.orderBy(orders);
    }

    queryBuilder = queryBuilder.skip((page - 1) * 10).take(10);

    const count = queryBuilder.getCount();
    const data = queryBuilder.getMany();

    const result = await Promise.all([count, data]);

    return {
      data: result[1],
      number_of_pages: Math.ceil(result[0] / 10),
    };
  }

  async acceptLoanContractRequest(id: string, user_id: string, bank_account_id: string | null): Promise<void> {
    const LoanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (LoanContractRequest.receiver_id == user_id && LoanContractRequest.status != LoanContractRequestStatus.pending) {
      // throw new AppError('Loan contract request is not pending. Current status: ' + LoanContractRequest.status, 400);
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyAcceptWhenStatusIsPending,
        {
          statusCode: ServerCodes.LoanRequestCode.AcceptFailed,
          details: 'Current status: ' + LoanContractRequest.status,
        },
      );
    }
    if (LoanContractRequest.receiver_id != user_id) {
      // throw new AppError('You are not receiver of this loan contract request', 400);
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.YouAreNotReceiverOfThisLoanContractRequest,
        {
          statusCode: ServerCodes.LoanRequestCode.AcceptFailed,
        },
      );
    }
    let lenderBankAccount = null;
    if (bank_account_id != null) {
      lenderBankAccount = await this.bankAccountService.getBankAccountById(bank_account_id);
    } else {
      lenderBankAccount = await this.bankAccountService.getPrimaryBankAccount(user_id);
    }
    if (lenderBankAccount == null) {
      throw AppError.notFound(APP_MESSAGES.BankMessage.LenderBankAccountIsNotExisted);
    }
    await this.loanContractRequestRepository.update(
      { id },
      { status: LoanContractRequestStatus.waiting_for_payment, receiver_bank_account_id: lenderBankAccount.id },
    );
  }

  async rejectLoanContractRequest(id: string, user_id: string): Promise<void> {
    const loanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (loanContractRequest.receiver_id == user_id && loanContractRequest.status != LoanContractRequestStatus.pending) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyRejectWhenStatusIsPending,
        {
          statusCode: ServerCodes.LoanRequestCode.RejectFailed,
          details: 'Current status: ' + loanContractRequest.status,
        },
      );
    }
    await this.loanContractRequestRepository.update({ id }, { status: LoanContractRequestStatus.rejected });
  }

  async cancelLoanContractRequest(id: string, user_id: string): Promise<void> {
    const loanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (loanContractRequest.sender_id == user_id && loanContractRequest.status != LoanContractRequestStatus.pending) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyCancleWhenStatusIsPending,
        {
          statusCode: ServerCodes.LoanRequestCode.CancleFailed,
          details: 'This loan contract request is not pending. Current status: ' + loanContractRequest.status,
        },
      );
    }
    if (
      loanContractRequest.receiver_id == user_id &&
      loanContractRequest.status != LoanContractRequestStatus.waiting_for_payment
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyCancleWhenStatusIsPending,
        {
          statusCode: ServerCodes.LoanRequestCode.CancleFailed,
          details:
            'This loan contract request is not waiting for payment. Current status: ' + loanContractRequest.status,
        },
      );
    }
    await this.loanContractRequestRepository.update({ id }, { status: LoanContractRequestStatus.cancle });
  }

  async payLoanContractRequest(
    id: string,
    user_id: string,
    payment_method: PaymentMethods = PaymentMethods.zalo_pay,
  ): Promise<Transaction> {
    const loanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (loanContractRequest.receiver_id != user_id) {
      // throw new AppError('You are not receiver of this loan contract request', 400);
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.YouAreNotReceiverOfThisLoanContractRequest,
        {
          statusCode: ServerCodes.LoanRequestCode.PaymentFailed,
        },
      );
    }
    if (loanContractRequest.status != LoanContractRequestStatus.waiting_for_payment) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyPayWhenStatusIsWaitingForPayment,
        {
          statusCode: ServerCodes.LoanRequestCode.PaymentFailed,
          details:
            'This loan contract request is not waiting for payment. Current status: ' + loanContractRequest.status,
        },
      );
    }
    const zaloPayOrderRequest: ZaloPayOrderRequest = {
      app_user: user_id,
      app_time: new Date(),
      amount: loanContractRequest.loan_amount * 0.01,
      description: 'Thanh toán yêu cầu vay ' + loanContractRequest.id,
      embed_data: {
        loan_contract_request_id: loanContractRequest.id,
      },
      item: [
        {
          item_id: loanContractRequest.id,
          item_type: 'loan_contract_request',
          item_name: 'Yêu cầu vay ' + loanContractRequest.id,
          item_price: loanContractRequest.loan_amount * 0.01,
          item_quantity: 1,
        },
      ],
      bank_code: 'zalopayapp',
    };
    const zaloPayResponse = await this.zaloPayService.createOrder(zaloPayOrderRequest);
    if (zaloPayResponse.return_code != 1) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, APP_MESSAGES.LoanContractRequestMessage.AnErrorOccurredWhileProcessingThePayment, {
        statusCode: ServerCodes.LoanRequestCode.PaymentFailed,
        details: zaloPayResponse.return_message,
      });
    }
    const transaction: Transaction = new Transaction();
    transaction.id_third_party = zaloPayResponse.app_trans_id;
    transaction.payment_method = PaymentMethods.zalo_pay;
    transaction.status = TransactionStatus.pending;
    transaction.amount = loanContractRequest.loan_amount * 0.01;
    transaction.user_id = user_id;
    transaction.title = 'Thanh toán yêu cầu vay ' + loanContractRequest.id;
    transaction.description = 'Thanh toán yêu cầu vay ' + loanContractRequest.id;
    transaction.items = [
      {
        item_id: loanContractRequest.id,
        item_type: 'loan_contract_request',
        item_name: 'Yêu cầu vay ' + loanContractRequest.id,
        item_price: loanContractRequest.loan_amount * 0.01,
        item_quantity: 1,
      },
    ];
    transaction.embed_data = zaloPayResponse;
    return await this.transactionRepository.save(transaction);
  }
}

export default LoanContractRequestService;
