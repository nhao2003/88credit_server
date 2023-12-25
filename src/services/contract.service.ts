import { Repository, DataSource, QueryFailedError } from 'typeorm';
import Contract from '~/models/databases/Contract';
import ZaloPayService, { ZaloPayCallbackResponse } from './zalopay.service';
import LoanRequest from '~/models/databases/LoanRequest';
import ContractTemplate from '~/models/databases/ContractTemplate';
import { LoanContractRequestStatus, TransactionStatus } from '~/constants/enum';
import { Service } from 'typedi';
import Transaction from '~/models/databases/Transaction';
import BankService from './bank.service';
import appConfig from '~/constants/configs';
import FindResult from '~/models/typing/findResult';
import { ContractQuery } from '~/models/typing/base_query';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { AppError } from '~/models/Error';
@Service()
class ContractService {
  private contractRepository: Repository<Contract>;
  private loanRequestRepository: Repository<LoanRequest>;
  private zaloPayService: ZaloPayService;
  private bankService: BankService;
  private contractTemplateRepository: Repository<ContractTemplate>;
  private transactionRepository: Repository<Transaction>;
  constructor(dataSource: DataSource, zaloPayService: ZaloPayService) {
    this.contractRepository = dataSource.getRepository(Contract);
    this.loanRequestRepository = dataSource.getRepository(LoanRequest);
    this.zaloPayService = zaloPayService;
    this.bankService = new BankService(dataSource);
    this.contractTemplateRepository = dataSource.getRepository(ContractTemplate);
    this.transactionRepository = dataSource.getRepository(Transaction);
  }

  public async getContractById(id: string): Promise<Contract | null> {
    return await this.contractRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async getContracts(query: Record<string, any>): Promise<{
    number_of_pages: number;
    contracts: Contract[];
  }> {
    const page = query.page || 1;
    const take = appConfig.ResultPerPage;
    const offset = (page - 1) * take;
    const where = query.wheres || [];
    const order = query.orders || {};
    let queryBuilder = this.contractRepository.createQueryBuilder();
    where.forEach((w: string) => {
      queryBuilder = queryBuilder.andWhere('Contract.' + w);
    });
    queryBuilder = queryBuilder.orderBy(order);

    const count = queryBuilder.getCount();
    const getMany = queryBuilder.limit(take).offset(offset).getMany();

    const [contracts, total] = await Promise.all([getMany, count]);
    return {
      number_of_pages: Math.ceil(total / take),
      contracts,
    };
  }

  public async verifyZaloPayPaymentAndCreateContract(
    type: number,
    mac: string,
    data: string,
  ): Promise<{
    return_code: number;
    return_message: string;
  }> {
    if (!this.zaloPayService.verifyOrderMac(mac, data)) {
      return {
        return_code: 0,
        return_message: 'Invalid mac',
      };
    }
    const contractData = JSON.parse(data) as ZaloPayCallbackResponse;
    const loan_contract_request_id = JSON.parse(contractData.embed_data).loan_contract_request_id;
    const loanContractRequest = await this.loanRequestRepository.findOne({
      where: {
        id: loan_contract_request_id,
      },
    });
    if (loanContractRequest == null) {
      return {
        return_code: 0,
        return_message: 'Loan contract request not found',
      };
    }
    const contractTemplate = await this.contractTemplateRepository
      .createQueryBuilder()
      .orderBy('created_at', 'DESC')
      .getOne();
    if (contractTemplate == null) {
      return {
        return_code: 0,
        return_message: 'Contract template not found',
      };
    }
    const contract = new Contract();
    contract.loan_contract_request_id = loan_contract_request_id;
    contract.contract_template_id = contractTemplate.id;
    contract.lender_id = loanContractRequest.receiver_id;
    contract.lender_bank_card_id = loanContractRequest.receiver_bank_card_id;
    contract.borrower_id = loanContractRequest.sender_id;
    contract.borrower_bank_card_id = loanContractRequest.sender_bank_card_id;
    contract.loan_reason_type = loanContractRequest.loan_reason_type;
    contract.loan_reason = loanContractRequest.loan_reason;
    contract.amount = loanContractRequest.loan_amount;
    contract.interest_rate = loanContractRequest.interest_rate;
    contract.tenure_in_months = loanContractRequest.loan_tenure_months;
    contract.overdue_interest_rate = loanContractRequest.overdue_interest_rate;
    contract.created_at = new Date();
    contract.expired_at = new Date();
    contract.expired_at.setMonth(contract.expired_at.getMonth() + contract.tenure_in_months);
    loanContractRequest.status = LoanContractRequestStatus.paid;
    const { app_trans_id } = JSON.parse(data);
    await Promise.all([
      this.contractRepository.save(contract),
      this.loanRequestRepository.save(loanContractRequest),
      this.transactionRepository.update(
        {
          id_third_party: app_trans_id,
        },
        {
          status: TransactionStatus.success,
          transaction_at: new Date(),
        },
      ),
    ]);
    return {
      return_code: 1,
      return_message: 'Success',
    };
  }
  buildContractRequestQuery(query: Record<string, any>): ContractQuery {
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
      .filter((key) => key.startsWith('contract_'))
      .forEach((key) => {
        postQueries[key.replace('contract_', '')] = query[key];
      });

    Object.keys(query)
      .filter((key) => key.startsWith('lender_'))
      .forEach((key) => {
        lenderQueries[key.replace('lender_', '')] = query[key];
      });

    Object.keys(query)
      .filter((key) => key.startsWith('borrower_'))
      .forEach((key) => {
        borrowerQueries[key.replace('borrower_', '')] = query[key];
      });

    const postWhere: string[] = buildQuery(postQueries);
    const lenderWhere: string[] = buildQuery(lenderQueries);
    const borrowerWhere: string[] = buildQuery(borrowerQueries);

    const order = buildOrder(orders as string, 'Contract');

    return {
      page: pageParam,
      wheres: postWhere,
      lenderWhere,
      borrowerWhere,
      orders: order,
    };
  }

  async getLoanContractRequestsByQuery(query: ContractQuery, user_id?: string): Promise<FindResult> {
    const { page, wheres, orders, lenderWhere, borrowerWhere } = query;
    let queryBuilder = this.contractRepository.createQueryBuilder();
    if (user_id != null)
      queryBuilder = queryBuilder.where('(lender.id = :user_id OR borrower.id = :user_id)', { user_id });

    queryBuilder = queryBuilder
      .leftJoinAndSelect('Contract.lender', 'lender')
      .leftJoinAndSelect('Contract.borrower', 'borrower');

    if (wheres != null && wheres.length > 0) {
      wheres.forEach((where: string) => {
        queryBuilder = queryBuilder.andWhere('Contract.' + where);
      });
    }

    if (lenderWhere != null && lenderWhere.length > 0) {
      lenderWhere.forEach((where: string) => {
        queryBuilder = queryBuilder.andWhere('lender.' + where);
      });
    }

    if (borrowerWhere != null && borrowerWhere.length > 0) {
      borrowerWhere.forEach((where: string) => {
        queryBuilder = queryBuilder.andWhere('borrower.' + where);
      });
    }

    const take = appConfig.ResultPerPage;
    if (orders != null && orders.length > 0) {
      queryBuilder = queryBuilder.orderBy(orders);
    }

    queryBuilder = queryBuilder.skip((page - 1) * take).take(take);

    const getCount = queryBuilder.getCount();
    const getMany = queryBuilder.getMany();
    console.log(queryBuilder.getQuery());

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
}

export default ContractService;
