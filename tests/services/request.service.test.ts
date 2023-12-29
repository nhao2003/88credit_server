import { DataSource, Repository } from 'typeorm';
import LoanContractRequestService from '../../src/services/request.service';
import { AppError } from '../../src/models/Error';
import LoanRequestCreateData from '../../src/models/typing/request/RequestCreateData';
import { LoanContractRequestTypes, LoanContractRequestStatus, LoanReasonTypes } from '../../src/constants/enum';
import ZaloPayService from '../../src/services/zalopay.service';
import LoanRequest from '../../src/models/databases/LoanRequest';
import Transaction from '../../src/models/databases/Transaction';
import BankAccountService from '../../src/services/bank.service';
import exp from 'constants';
import e from 'express';
import Bank from '../../src/models/databases/Bank';
import BankCard from '../../src/models/databases/BankCard';
describe('LoanContractRequestService', () => {
  let loanContractRequestService: LoanContractRequestService;
  let dataSource: DataSource;
  let loanContractRequestRepository: Repository<LoanRequest>;
  let transactionRepository: Repository<Transaction>;
  let zaloPayService: ZaloPayService;
  let bankAccountService: BankAccountService;
  let bankCardRepository: Repository<BankCard>;
  let bankRepository: Repository<Bank>;
  beforeEach(() => {
    dataSource = {
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === LoanRequest) {
          return loanContractRequestRepository;
        } else if (entity === Transaction) {
          return transactionRepository;
        } else if (entity === Bank) {
          return bankRepository;
        } else if (entity === BankCard) {
          return bankCardRepository;
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
        video_confirmation: 'test',
        portait_photo: 'test',
        id_card_front_photo: 'test',
        id_card_back_photo: 'test',
        sender_id: 'sender123',
        receiver_id: 'receiver123',
        description: 'description',
      };

      bankRepository = {
        findOne: jest.fn().mockResolvedValue({ id: '1', bin: '123' }),
      } as any;

      bankCardRepository = {
        findOne: jest.fn().mockResolvedValue({ id: '1', bank_id: '1', card_number: '123456789' }),
      } as any;
      loanContractRequestRepository = {
        insert: jest.fn().mockImplementation((data) => {
          return Promise.resolve({ identifiers: [{ id: 1 }] });
        }),
        findOne: jest.fn().mockResolvedValue(data), // Fix: Mock the findOne method to return a resolved Promise with the data parameter
        save: jest.fn().mockResolvedValue(data),
      } as any;
      dataSource = {
        getRepository: jest.fn().mockImplementation((entity) => {
          if (entity === LoanRequest) {
            return loanContractRequestRepository;
          } else if (entity === Transaction) {
            return transactionRepository;
          } else if (entity === Bank) {
            return bankRepository;
          } else if (entity === BankCard) {
            return bankCardRepository;
          }
        }),
      } as any;
      // Act
      loanContractRequestService = new LoanContractRequestService(dataSource, zaloPayService);
      await loanContractRequestService.createLoanContractRequest(data);

      // Act
      loanContractRequestService = new LoanContractRequestService(dataSource, zaloPayService);
      await loanContractRequestService.createLoanContractRequest(data);

      // Assert
      expect(loanContractRequestRepository.save).toHaveBeenCalled();
    });
  });

  describe('LoanContractRequestService', () => {
    let loanContractRequestService: LoanContractRequestService;
    let dataSource: DataSource;
    let loanContractRequestRepository: Repository<LoanRequest>;
    let transactionRepository: Repository<Transaction>;
    let zaloPayService: ZaloPayService;
    let bankRepository: Repository<Bank>;
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
          video_confirmation: 'test',
          portait_photo: 'test',
          id_card_front_photo: 'test',
          id_card_back_photo: 'test',
          sender_id: 'sender123',
          receiver_id: 'receiver123',
          description: 'description',
        };
        bankRepository = {
          findOne: jest.fn().mockResolvedValue({ id: '1', bin: '123' }),
        } as any;

        bankCardRepository = {
          findOne: jest.fn().mockResolvedValue({ id: '1', bank_id: '1', card_number: '123456789' }),
        } as any;
        loanContractRequestRepository = {
          insert: jest.fn().mockImplementation((data) => {
            return Promise.resolve({ identifiers: [{ id: 1 }] });
          }),
          findOne: jest.fn().mockResolvedValue(data), // Fix: Mock the findOne method to return a resolved Promise with the data parameter
          save: jest.fn().mockResolvedValue(data),
        } as any;
        dataSource = {
          getRepository: jest.fn().mockImplementation((entity) => {
            if (entity === LoanRequest) {
              return loanContractRequestRepository;
            } else if (entity === Transaction) {
              return transactionRepository;
            } else if (entity === Bank) {
              return bankRepository;
            } else if (entity === BankCard) {
              return bankCardRepository;
            }
          }),
        } as any;
        // Act
        loanContractRequestService = new LoanContractRequestService(dataSource, zaloPayService);
        await loanContractRequestService.createLoanContractRequest(data);

        // Assert
        expect(loanContractRequestRepository.save).toHaveBeenCalled();
      });
    });

    // Add more test cases as needed
  });
});
