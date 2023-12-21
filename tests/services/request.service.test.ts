import { DataSource, Repository } from 'typeorm';
import LoanContractRequestService from '../../src/services/request.service';
import { AppError } from '../../src/models/Error';
import LoanRequestCreateData from '../../src/models/typing/request/RequestCreateData';
import { LoanContractRequestTypes, LoanContractRequestStatus, LoanReasonTypes } from '../../src/constants/enum';
import ZaloPayService from '../../src/services/zalopay.service';
import LoanRequest from '../../src/models/databases/LoanRequest';
import Transaction from '../../src/models/databases/Transaction';
import BankAccountService from '../../src/services/bank_account.service';
import exp from 'constants';
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
        orders: ['-created_at'],
        search: 'test',
        request_loan_amount: {
          eq: 1000,
        },
        sender_id: {
          eq: 'sender123',
        },
        receiver_id: {
          eq: 'receiver123',
        },
      };

      // Act
      const result = loanContractRequestService.buildLoanContractRequestQuery(query);

      // Assert
      expect(result.page).toBe(1);
      expect(result.orders).toEqual({ 'LoanRequest.created_at': 'DESC' });
    });
  });

  describe('createLoanContractRequest', () => {
    it('should create a loan contract request', async () => {
      // Arrange
      const data: LoanRequestCreateData = {
        loan_amount: 1000,
        interest_rate: 0.1,
        overdue_interest_rate: 0.2,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.other,
        loan_reason: 'test',
        video_comfirmation: 'test',
        portait_photo: 'test',
        id_card_front_photo: 'test',
        id_card_back_photo: 'test',
        sender_bank_account_id: 'test',
        sender_id: 'sender123',
        receiver_id: 'receiver123',
      };

      loanContractRequestRepository = {
        insert: jest.fn().mockImplementation((data) => {
          return Promise.resolve({ identifiers: [{ id: 1 }] });
        }),
      } as any;

      loanContractRequestRepository = {
        insert: jest.fn().mockImplementation((data) => {
          return Promise.resolve({ identifiers: [{ id: 1 }] });
        }),
      } as any;

      // Act
      loanContractRequestService = new LoanContractRequestService(dataSource, zaloPayService);
      await loanContractRequestService.createLoanContractRequest(data);

      // Assert
      expect(loanContractRequestRepository.insert).toBeCalledWith(data);
    });
  });

  // Add more test cases as needed
});
