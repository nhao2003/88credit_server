import { DataSource, Repository } from 'typeorm';
import LoanContractRequestService from '../../src/services/request.service';
import { AppError } from '../../src/models/Error';
import LoanRequestCreateData from '../../src/models/typing/request/RequestCreateData';
import { LoanContractRequestTypes, LoanContractRequestStatus, LoanReasonTypes } from '../../src/constants/enum';
import ZaloPayService from '../../src/services/zalopay.service';
import LoanRequest from '../../src/models/databases/LoanRequest';
import Transaction from '../../src/models/databases/Transaction';
import BankAccountService from '../../src/services/bank_account.service';
describe('LoanContractRequestService', () => {
  let loanContractRequestService: LoanContractRequestService;
  let dataSource: DataSource;
  let loanContractRequestRepository: Repository<LoanRequest>;
  let transactionRepository: Repository<Transaction>;
  let zaloPayService: ZaloPayService;
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    dataSource = {
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === LoanRequest) {
          return loanContractRequestRepository;
        } else if (entity === Transaction) {
          return transactionRepository;
        }
      }),
    } as any;
    zaloPayService = new ZaloPayService();
    loanContractRequestService = new LoanContractRequestService(dataSource, zaloPayService);
  });

  describe('buildLoanContractRequestQuery', () => {
    it('should build the loan contract request query correctly', () => {
      // Arrange
      const query = {
        page: 1,
        orders: ['created_at DESC'],
        search: 'test',
        request_loan_amount: 1000,
        sender_id: 'sender123',
        receiver_id: 'receiver123',
      };

      // Act
      const result = loanContractRequestService.buildLoanContractRequestQuery(query);

      // Assert
      expect(result.page).toBe(1);
      expect(result.orders).toEqual(['created_at DESC']);
      expect(result.wheres).toEqual(['loan_amount = 1000']);
      expect(result.lenderWhere).toEqual(['id = sender123']);
      expect(result.borrowerWhere).toEqual(['id = receiver123']);
    });
  });

  describe('createLoanContractRequest', () => {
    it('should create a loan contract request', async () => {
      // Arrange
      const data = {
        id: 'request123',
        loan_amount: 1000,
      };

      // Act
      await loanContractRequestService.createLoanContractRequest(data);

      // Assert
      const loanRequest = await dataSource.getRepository(LoanRequest).findOne({ where: { id: 'request123' } });
      expect(loanRequest).toBeDefined();
      expect(loanRequest?.loan_amount).toBe(1000);
    });
  });

  // Add more test cases as needed
});
