import { Service } from 'typedi';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
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
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import { Server } from 'http';
import ServerCodes from '~/constants/server_codes';
import BankService from './bank.service';
import appConfig from '~/constants/configs';
import FindResult from '~/models/typing/findResult';

@Service()
class LoanContractRequestService {
  private loanContractRequestRepository: Repository<LoanRequest>;
  private transactionRepository: Repository<Transaction>;
  private zaloPayService: ZaloPayService;
  private bankService: BankService;
  constructor(dataSource: DataSource, zaloPayService: ZaloPayService) {
    this.loanContractRequestRepository = dataSource.getRepository(LoanRequest);
    this.transactionRepository = dataSource.getRepository(Transaction);
    this.zaloPayService = zaloPayService;
    this.bankService = new BankService(dataSource);
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
    const loanContractRequest = new LoanRequest();
    loanContractRequest.sender_id = data.sender_id;
    loanContractRequest.receiver_id = data.receiver_id;
    loanContractRequest.description = data.description;
    loanContractRequest.loan_amount = data.loan_amount;
    loanContractRequest.interest_rate = data.interest_rate;
    loanContractRequest.overdue_interest_rate = data.overdue_interest_rate;
    loanContractRequest.loan_tenure_months = data.loan_tenure_months;
    loanContractRequest.loan_reason_type = data.loan_reason_type;
    loanContractRequest.loan_reason = data.loan_reason;
    loanContractRequest.video_confirmation = data.video_confirmation;
    loanContractRequest.portait_photo = data.portait_photo;
    loanContractRequest.id_card_front_photo = data.id_card_front_photo;
    loanContractRequest.id_card_back_photo = data.id_card_back_photo;
    loanContractRequest.status = LoanContractRequestStatus.pending;
    const bankCard = await this.bankService.getPrimaryBankCard(data.sender_id);
    if (bankCard == null) {
      throw AppError.notFound(APP_MESSAGES.BankMessage.BankCardIsNotExisted);
    }
    loanContractRequest.sender_bank_card_id = bankCard.id;
    await this.loanContractRequestRepository.save(loanContractRequest);
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
    // SELECT * FROM LoanRequest WHERE id = id AND (sender_id = user_id OR receiver_id = user_id)
    const loanRequest = await this.loanContractRequestRepository
      .createQueryBuilder()
      .where({ id })
      .andWhere('(sender_id = :user_id OR receiver_id = :user_id)', { user_id })
      .getOne();

    if (loanRequest == null) {
      throw AppError.notFound();
    }
    return loanRequest;
  }

  async getLoanContractRequestsByQuery(query: LoanContractRequestQuery): Promise<FindResult<LoanRequest>> {
    const { page, wheres, orders, lenderWhere, borrowerWhere } = query;
    let queryBuilder = this.loanContractRequestRepository
      .createQueryBuilder()
      .where('(LoanRequest.sender_id = :user_id OR LoanRequest.receiver_id = :user_id)', { user_id: query.user_id })
      .leftJoinAndSelect('LoanRequest.sender', 'sender')
      .leftJoinAndSelect('LoanRequest.receiver', 'receiver')
      .leftJoinAndSelect('LoanRequest.sender_bank_card', 'sender_bank_card')
      .leftJoinAndSelect('LoanRequest.receiver_bank_card', 'receiver_bank_card')
      .leftJoinAndSelect('sender_bank_card.bank', 'sender_bank_card_bank')
      .leftJoinAndSelect('receiver_bank_card.bank', 'receiver_bank_card_bank');

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

    const take = appConfig.ResultPerPage;
    if (orders != null) {
      queryBuilder = queryBuilder.orderBy(orders);
    }

    queryBuilder = queryBuilder.skip((page - 1) * take).take(take);

    const getCount = queryBuilder.getCount();
    const getMany = queryBuilder.getMany();

    try {
      const [data, count] = await Promise.all([getMany, getCount]);
      return {
        number_of_pages: Math.ceil(count / take),
        data,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw AppError.queryFailed();
      } else throw error;
    }
  }

  async acceptLoanContractRequest(id: string, user_id: string, bank_account_id: string | null): Promise<void> {
    const LoanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (LoanContractRequest.receiver_id == user_id && LoanContractRequest.status != LoanContractRequestStatus.pending) {
      // throw new AppError('Loan contract request is not pending. Current status: ' + LoanContractRequest.status, 400);
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyAcceptWhenStatusIsPending,
        {
          serverCode: ServerCodes.LoanRequestCode.AcceptFailed,
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
          serverCode: ServerCodes.LoanRequestCode.AcceptFailed,
        },
      );
    }
    let lenderBankAccount = null;
    if (bank_account_id != null) {
      lenderBankAccount = await this.bankService.getBankCardById(bank_account_id);
    } else {
      lenderBankAccount = await this.bankService.getPrimaryBankCard(user_id);
    }
    if (lenderBankAccount == null) {
      throw AppError.notFound(APP_MESSAGES.BankMessage.LenderBankAccountIsNotExisted);
    }
    await this.loanContractRequestRepository.update(
      { id },
      { status: LoanContractRequestStatus.waiting_for_payment, receiver_bank_card_id: lenderBankAccount.id },
    );
  }

  async rejectLoanContractRequest(id: string, user_id: string, rejected_reason: string | null): Promise<void> {
    const loanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (loanContractRequest.receiver_id == user_id && loanContractRequest.status != LoanContractRequestStatus.pending) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyRejectWhenStatusIsPending,
        {
          serverCode: ServerCodes.LoanRequestCode.RejectFailed,
          details: 'Current status: ' + loanContractRequest.status,
        },
      );
    }
    // await this.loanContractRequestRepository.update({ id }, { status: LoanContractRequestStatus.rejected });
    loanContractRequest.status = LoanContractRequestStatus.rejected;
    loanContractRequest.rejected_reason = rejected_reason;
    await this.loanContractRequestRepository.save(loanContractRequest);
  }

  async cancelLoanContractRequest(id: string, user_id: string): Promise<void> {
    const loanContractRequest = await this.checkLoanContractRequestExistByIdAndUserOrThrowError(id, user_id);
    if (loanContractRequest.sender_id == user_id && loanContractRequest.status != LoanContractRequestStatus.pending) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyCancleWhenStatusIsPending,
        {
          serverCode: ServerCodes.LoanRequestCode.CancleFailed,
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
          serverCode: ServerCodes.LoanRequestCode.CancleFailed,
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
          serverCode: ServerCodes.LoanRequestCode.PaymentFailed,
        },
      );
    }
    if (loanContractRequest.status != LoanContractRequestStatus.waiting_for_payment) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        APP_MESSAGES.LoanContractRequestMessage.LoanRequestOnlyPayWhenStatusIsWaitingForPayment,
        {
          serverCode: ServerCodes.LoanRequestCode.PaymentFailed,
          details:
            'This loan contract request is not waiting for payment. Current status: ' + loanContractRequest.status,
        },
      );
    }
    const amount =
      Math.floor(loanContractRequest.loan_amount * 0.01) < 10000
        ? 10000
        : Math.floor(loanContractRequest.loan_amount * 0.01);
    const zaloPayOrderRequest: ZaloPayOrderRequest = {
      app_user: user_id,
      app_time: new Date(),
      amount: amount,
      description: 'Thanh toán yêu cầu vay ' + loanContractRequest.id,
      embed_data: {
        loan_contract_request_id: loanContractRequest.id,
      },
      item: [
        {
          item_id: loanContractRequest.id,
          item_type: 'loan_contract_request',
          item_name: 'Yêu cầu vay ' + loanContractRequest.id,
          item_price: amount,
          item_quantity: 1,
        },
      ],
      bank_code: 'zalopayapp',
      callback_url: 'https://eight8credit.onrender.com/contract/verify-zalopay-payment',
    };
    const zaloPayResponse = await this.zaloPayService.createOrder(zaloPayOrderRequest);
    if (zaloPayResponse.return_code != 1) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        APP_MESSAGES.LoanContractRequestMessage.AnErrorOccurredWhileProcessingThePayment,
        {
          serverCode: ServerCodes.LoanRequestCode.PaymentFailed,
          details: zaloPayResponse,
        },
      );
    }
    const transaction = new Transaction();

    transaction.id_third_party = zaloPayResponse.app_trans_id;
    transaction.payment_method = payment_method;
    transaction.status = TransactionStatus.pending;
    transaction.amount = amount;
    transaction.user_id = user_id;
    transaction.title = 'Thanh toán yêu cầu vay ' + loanContractRequest.id;
    transaction.description = 'Thanh toán yêu cầu vay ' + loanContractRequest.id;
    transaction.items = [
      {
        item_id: loanContractRequest.id,
        item_type: 'loan_contract_request',
        item_name: 'Yêu cầu vay ' + loanContractRequest.id,
        item_price: amount,
        item_quantity: 1,
      },
    ];
    transaction.embed_data = zaloPayResponse;
    return await this.transactionRepository.save(transaction);
  }
}

export default LoanContractRequestService;
