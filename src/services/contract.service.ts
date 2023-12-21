import { Repository, DataSource } from 'typeorm';
import Contract from '~/models/databases/Contract';
import ZaloPayService, { ZaloPayCallbackResponse } from './zalopay.service';
import LoanRequest from '~/models/databases/LoanRequest';
import BankAccountService from './bank_account.service';
import ContractTemplate from '~/models/databases/ContractTemplate';
import { LoanContractRequestStatus, TransactionStatus } from '~/constants/enum';
import { Service } from 'typedi';
import Transaction from '~/models/databases/Transaction';
@Service()
class ContractService {
  private contractRepository: Repository<Contract>;
  private loanRequestRepository: Repository<LoanRequest>;
  private zaloPayService: ZaloPayService;
  private bankAccountService: BankAccountService;
  private contractTemplateRepository: Repository<ContractTemplate>;
  private transactionRepository: Repository<Transaction>;
  constructor(dataSource: DataSource, zaloPayService: ZaloPayService) {
    this.contractRepository = dataSource.getRepository(Contract);
    this.loanRequestRepository = dataSource.getRepository(LoanRequest);
    this.zaloPayService = zaloPayService;
    this.bankAccountService = new BankAccountService(dataSource);
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
    const limit = 10;
    const offset = (page - 1) * limit;
    const where = query.wheres || [];
    const order = query.orders || {};
    let queryBuilder = this.contractRepository.createQueryBuilder();
    where.forEach((w: string) => {
      queryBuilder = queryBuilder.andWhere('Contract.' + w);
    });
    queryBuilder = queryBuilder.orderBy(order);

    const count = queryBuilder.getCount();
    const getMany = queryBuilder.limit(limit).offset(offset).getMany();

    const [contracts, total] = await Promise.all([getMany, count]);
    return {
      number_of_pages: Math.ceil(total / limit),
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
    contract.lender_bank_account_id = loanContractRequest.receiver_bank_account_id;
    contract.borrower_id = loanContractRequest.sender_id;
    contract.borrower_bank_account_id = loanContractRequest.sender_bank_account_id;
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
}

export default ContractService;
