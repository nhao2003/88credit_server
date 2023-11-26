import { DataSource, Repository } from 'typeorm';
import LoanContractRequestService from '../../src/services/request.service';
import { LoanContractRequest } from '../../src/models/databases/LoanContractRequest';
import { AppError } from '../../src/models/Error';
import LoanRequestCreateData from '../../src/models/typing/request/RequestCreateData';
import { LoanContractRequestTypes, LoanContractRequestStatus, LoanReasonTypes } from '../../src/constants/enum';
describe('LoanContractRequestService', () => {
  let loanContractRequestService: LoanContractRequestService;
  let loanContractRequestRepositoryMock: Repository<LoanContractRequest>;
  let dataSourceMock: DataSource;

  describe('createLoanContractRequest', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.insert = jest.fn();

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });
    it('should insert a new loan contract request', async () => {
      const loanRequestData: LoanRequestCreateData = {
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      await loanContractRequestService.createLoanContractRequest(loanRequestData);
      expect(loanContractRequestRepositoryMock.insert).toHaveBeenCalledWith(loanRequestData);
    });
  });

  describe('getLoanContractRequestById', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.findOne = jest.fn();

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });
    it('should return a loan contract request by ID', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContractRequest khi gọi với tham số là 'sampleId'
      loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(mockLoanContractRequest);

      // Gọi phương thức cần kiểm thử
      const result = await loanContractRequestService.getLoanContractRequestById('sampleId');

      // Kiểm tra xem kết quả trả về có đúng là mockLoanContractRequest hay không
      expect(result).toEqual(mockLoanContractRequest);

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'sampleId' không
      expect(loanContractRequestRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 'sampleId' } });
    });

    it('should return null if loan contract request is not found by ID', async () => {
      // Giả lập phương thức findOne trả về null khi gọi với bất kỳ tham số nào
      loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

      // Gọi phương thức cần kiểm thử
      const result = await loanContractRequestService.getLoanContractRequestById('nonExistentId');

      // Kiểm tra xem kết quả trả về có là null hay không
      expect(result).toBeNull();

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'nonExistentId' không
      expect(loanContractRequestRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 'nonExistentId' } });
    });
  });

  describe('checkLoanContractRequestExistOrThrowError', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.findOne = jest.fn();

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should return loan contract request if it exists', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContractRequest khi gọi với tham số là 'sampleId'
      loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(mockLoanContractRequest);

      // Gọi phương thức cần kiểm thử
      const result = await loanContractRequestService.checkLoanContractRequestExistOrThrowError('sampleId');

      // Kiểm tra xem kết quả trả về có đúng là mockLoanContractRequest hay không
      expect(result).toEqual(mockLoanContractRequest);

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'sampleId' không
      expect(loanContractRequestRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 'sampleId' } });
    });
    it('should throw error if loan contract request is not found by ID', async () => {
      // Giả lập phương thức findOne trả về null khi gọi với bất kỳ tham số nào
      loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

      // Gọi phương thức cần kiểm thử
      const result = loanContractRequestService.checkLoanContractRequestExistOrThrowError('nonExistentId');

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'nonExistentId' không
      expect(loanContractRequestRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 'nonExistentId' } });

      // Kiểm tra xem phương thức checkLoanContractRequestExistOrThrowError có throw error không
      await expect(result).rejects.toThrowError(new AppError('Loan contract request not found', 404));
    });
  });

  describe('checkLoanContractRequestExistByIdAndUserOrThrowError', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.findOne = jest.fn();
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
      });

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should return loan contract request if it exists and user is sender', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContractRequest khi gọi với tham số là 'sampleId'
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(mockLoanContractRequest),
      });

      // Gọi phương thức cần kiểm thử
      const result = await loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError(
        'sampleId',
        'senderId',
      );

      // Kiểm tra xem kết quả trả về có đúng là mockLoanContractRequest hay không
      expect(result).toEqual(mockLoanContractRequest);
    });

    it('should throw error if loan contract request is not found by ID', async () => {
      // Giả lập phương thức findOne trả về null khi gọi với bất kỳ tham số nào
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
      });

      expect(
        loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError('nonExistentId', 'senderId'),
      ).rejects.toThrowError(new AppError('Loan contract request not found', 404));
    });
  });

  describe('buildLoanContractRequestQuery', () => {
    it('should build the loan contract request query correctly', () => {
      const query = {
        page: 2,
        request_status: { eq: "'waiting_for_borrower_confirmation'" },
        request_type: { eq: "'borrowing'" },
        request_loan_amount: { eq: '1000' },
        request_interest_rate: { eq: '0.05' },
        request_loan_tenure_months: { eq: '12' },
        request_loan_reason_type: { eq: "'business'" },
        sender_id: { eq: "'senderId'" },
        receiver_id: { eq: "'receiverId'" },
        lender_id: { eq: "'lenderId'" },
        borrower_id: { eq: "'borrowerId'" },
        orders: 'id',
      };

      const expectedWhere = [
        "status = 'waiting_for_borrower_confirmation'",
        "type = 'borrowing'",
        'loan_amount = 1000',
        'interest_rate = 0.05',
        'loan_tenure_months = 12',
        "loan_reason_type = 'business'",
      ];
      const expectedOrder = { 'LoanContractRequest.id': 'ASC' };

      const result = loanContractRequestService.buildLoanContractRequestQuery(query);

      expect(result.page).toBe(2);
      expect(result.wheres).toEqual(expectedWhere);
      expect(result.orders).toEqual(expectedOrder);
    });
  });

  describe('buildLoanContractRequestQuery', () => {
    it('should build the loan contract request query correctly', () => {
      const query = {
        request_status: { eq: "'waiting_for_borrower_confirmation'" },
        request_type: { eq: "'borrowing'" },
        request_loan_amount: { eq: '1000' },
        request_interest_rate: { eq: '0.05' },
        request_loan_tenure_months: { eq: '12' },
        request_loan_reason_type: { eq: "'business'" },
        sender_id: { eq: "'senderId'" },
        receiver_id: { eq: "'receiverId'" },
        lender_id: { eq: "'lenderId'" },
        borrower_id: { eq: "'borrowerId'" },
        orders: 'id',
      };

      const expectedWhere = [
        "status = 'waiting_for_borrower_confirmation'",
        "type = 'borrowing'",
        'loan_amount = 1000',
        'interest_rate = 0.05',
        'loan_tenure_months = 12',
        "loan_reason_type = 'business'",
      ];
      const expectedOrder = { 'LoanContractRequest.id': 'ASC' };

      const result = loanContractRequestService.buildLoanContractRequestQuery(query);

      expect(result.page).toBe(1);
      expect(result.wheres).toEqual(expectedWhere);
      expect(result.orders).toEqual(expectedOrder);
    });
  });

  describe('getLoanContractRequestsByQuery', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
      });

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should return loan contract requests by query', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContractRequest khi gọi với tham số là 'sampleId'
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([mockLoanContractRequest]),
      });

      // Gọi phương thức cần kiểm thử
      const result = await loanContractRequestService.getLoanContractRequestsByQuery({
        page: 1,
        wheres: [
          'status := waiting_for_borrower_confirmation',
          'type := borrowing',
          'loan_amount := 1000',
          'interest_rate := 0.05',
          'loan_tenure_months := 12',
          'loan_reason_type := business',
          'reason_for_loan := Expanding business',
          'notes := Additional notes',
        ],
        orders: ['id'],
        lenderWhere: ['id := sampleId'],
        borrowerWhere: ['id := sampleId'],
        user_id: 'senderId',
      });

      // Kiểm tra xem kết quả trả về có đúng là mockLoanContractRequest hay không
      expect(result).toEqual({
        data: [mockLoanContractRequest],
        number_of_pages: 1,
      });

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'sampleId' không
    });
  });

  describe('borrowerConfirmLoanContractRequest', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.findOne = jest.fn();
      loanContractRequestRepositoryMock.save = jest.fn();

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
      });

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should confirm loan contract request if it exists and user is borrower', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContractRequest khi gọi với tham số là 'sampleId'
      // loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(mockLoanContractRequest);
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);

      // Gọi phương thức cần kiểm thử
      await loanContractRequestService.borrowerConfirmLoanContractRequest('sampleId', 'receiverId');

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'sampleId' không
      expect(loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError).toHaveBeenCalledWith(
        'sampleId',
        'receiverId',
      );

      // Kiểm tra xem phương thức save có được gọi với tham số là mockLoanContractRequest không
      expect(loanContractRequestRepositoryMock.save).toHaveBeenCalledWith({
        ...mockLoanContractRequest,
        status: LoanContractRequestStatus.waiting_for_lender_confirmation,
      });
    });

    // it('should throw error if loan contract request is not found by ID', async () => {
    //   // Giả lập phương thức findOne trả về null khi gọi với bất kỳ tham số nào
    //   loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

    //   // Gọi phương thức cần kiểm thử
    //   expect(loanContractRequestService.borrowerConfirmLoanContractRequest('nonExistentId', 'receiverId')).rejects.toThrowError(
    //     new AppError('Loan contract request not found', 404),
    //   );

    //   // Kiểm tra xem phương thức findOne có được gọi với tham số 'nonExistentId' không
    //   expect(loanContractRequestRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 'nonExistentId' } }).

    // });

    describe('borrowerConfirmLoanContractRequest', () => {
      beforeEach(() => {
        loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
        dataSourceMock = {} as DataSource;

        // Giả lập một số phương thức cần thiết từ Repository
        loanContractRequestRepositoryMock.findOne = jest.fn();
        loanContractRequestRepositoryMock.save = jest.fn();

        // Gán mock Repository cho DataSource
        dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;

        loanContractRequestService = new LoanContractRequestService(dataSourceMock);
      });

      it('should update loan contract request status to waiting_for_lender_confirmation if borrower confirms the request', async () => {
        const mockLoanContractRequest = {
          id: 'sampleId',
          sender_id: 'senderId',
          receiver_id: 'receiverId',
          status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
          type: LoanContractRequestTypes.lending,
          loan_amount: 1000,
          interest_rate: 0.05,
          loan_tenure_months: 12,
          loan_reason_type: LoanReasonTypes.business,
          reason_for_loan: 'Expanding business',
          notes: 'Additional notes',
        };

        // Giả lập phương thức checkLoanContractRequestExistByIdAndUserOrThrowError trả về mockLoanContractRequest
        loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
          .fn()
          .mockResolvedValue(mockLoanContractRequest);

        // Gọi phương thức cần kiểm thử
        await loanContractRequestService.borrowerConfirmLoanContractRequest('sampleId', 'receiverId');

        // Kiểm tra xem trạng thái của loan contract request đã được cập nhật thành waiting_for_lender_confirmation hay chưa
        expect(mockLoanContractRequest.status).toEqual(LoanContractRequestStatus.waiting_for_lender_confirmation);

        // Kiểm tra xem phương thức save đã được gọi với đúng tham số hay không
        expect(loanContractRequestRepositoryMock.save).toHaveBeenCalledWith(mockLoanContractRequest);
      });

      it('should throw error if user is not borrower of the loan contract request', async () => {
        const mockLoanContractRequest = {
          id: 'sampleId',
          sender_id: 'senderId',
          receiver_id: 'receiverId',
          status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
          type: LoanContractRequestTypes.lending,
          loan_amount: 1000,
          interest_rate: 0.05,
          loan_tenure_months: 12,
          loan_reason_type: LoanReasonTypes.business,
          reason_for_loan: 'Expanding business',
          notes: 'Additional notes',
        };

        // Giả lập phương thức checkLoanContractRequestExistByIdAndUserOrThrowError trả về mockLoanContractRequest
        loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
          .fn()
          .mockResolvedValue(mockLoanContractRequest);

        // Gọi phương thức cần kiểm thử và kiểm tra xem có throw error không
        await expect(
          loanContractRequestService.borrowerConfirmLoanContractRequest('sampleId', 'nonBorrowerId'),
        ).rejects.toThrowError(new AppError('You are not borrower of this loan contract request', 400));
      });

      it('should throw error if loan contract request is not waiting for borrower confirmation', async () => {
        const mockLoanContractRequest = {
          id: 'sampleId',
          sender_id: 'senderId',
          receiver_id: 'receiverId',
          status: LoanContractRequestStatus.waiting_for_lender_confirmation,
          type: LoanContractRequestTypes.lending,
          loan_amount: 1000,
          interest_rate: 0.05,
          loan_tenure_months: 12,
          loan_reason_type: LoanReasonTypes.business,
          reason_for_loan: 'Expanding business',
          notes: 'Additional notes',
        };

        // Giả lập phương thức checkLoanContractRequestExistByIdAndUserOrThrowError trả về mockLoanContractRequest
        loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
          .fn()
          .mockResolvedValue(mockLoanContractRequest);

        // Gọi phương thức cần kiểm thử và kiểm tra xem có throw error không
        await expect(
          loanContractRequestService.borrowerConfirmLoanContractRequest('sampleId', 'receiverId'),
        ).rejects.toThrowError(new AppError('Loan contract request is not waiting for borrower confirmation', 400));
      });
    });
  });

  describe('lenderConfirmLoanContractRequest', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.findOne = jest.fn();
      loanContractRequestRepositoryMock.save = jest.fn();

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
      });

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should confirm loan contract request if it exists and user is lender', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_lender_confirmation,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);

      await loanContractRequestService.lenderConfirmLoanContractRequest('sampleId', 'senderId');

      expect(loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError).toHaveBeenCalledWith(
        'sampleId',
        'senderId',
      );

      expect(loanContractRequestRepositoryMock.save).toHaveBeenCalledWith({
        ...mockLoanContractRequest,
        status: LoanContractRequestStatus.waiting_for_lender_payment,
      });
    });

    it('should throw error if loanContractRequest.type === LoanContractRequestTypes.lending && loanContractRequest.sender_id !== user_id', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        lender_id: 'lenderId',
        status: LoanContractRequestStatus.waiting_for_lender_confirmation,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(
        loanContractRequestService.lenderConfirmLoanContractRequest('sampleId', 'nonSenderId'),
      ).rejects.toThrowError(new AppError('You are not lender of this loan contract request', 400));
    });

    it('should throw error if Loan contract request is not waiting for lender confirmation', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);

      await expect(
        loanContractRequestService.lenderConfirmLoanContractRequest('sampleId', 'senderId'),
      ).rejects.toThrowError(new AppError('Loan contract request is not waiting for lender confirmation', 400));
    });

    it('should throw error if user is not lender of the loan contract request', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        lender_id: 'lenderId',
        status: LoanContractRequestStatus.waiting_for_lender_confirmation,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(
        loanContractRequestService.lenderConfirmLoanContractRequest('sampleId', 'nonLenderId'),
      ).rejects.toThrowError(new AppError('You are not lender of this loan contract request', 400));
    });

    it('should confirm loan contract request if it exists and user is borrower', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'lenderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_lender_confirmation,
        type: LoanContractRequestTypes.borrowing,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);

      await loanContractRequestService.lenderConfirmLoanContractRequest('sampleId', 'receiverId');

      expect(loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError).toHaveBeenCalledWith(
        'sampleId',
        'receiverId',
      );

      expect(loanContractRequestRepositoryMock.save).toHaveBeenCalledWith({
        ...mockLoanContractRequest,
        status: LoanContractRequestStatus.waiting_for_lender_payment,
      });
    });

    it('should throw error if user is not lender or borrower of the loan contract request', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'lenderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_lender_confirmation,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(
        loanContractRequestService.lenderConfirmLoanContractRequest('sampleId', 'nonParticipantId'),
      ).rejects.toThrowError(new AppError('You are not lender of this loan contract request', 400));
    });
  });

  describe('lenderPayLoanContractRequest', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      // Giả lập một số phương thức cần thiết từ Repository
      loanContractRequestRepositoryMock.findOne = jest.fn();
      loanContractRequestRepositoryMock.save = jest.fn();

      // Gán mock Repository cho DataSource
      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
      });

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should pay loan contract request if it exists and user is lender', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_lender_payment,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContract
      // loanContractRequestRepositoryMock.findOne = jest.fn().mockResolvedValue(mockLoanContractRequest);
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);

      // Gọi phương thức cần kiểm thử
      await loanContractRequestService.lenderPayLoanContractRequest('sampleId', 'senderId');

      // Kiểm tra xem phương thức findOne có được gọi với tham số 'sampleId' không
      expect(loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError).toHaveBeenCalledWith(
        'sampleId',
        'senderId',
      );

      // Kiểm tra xem phương thức save có được gọi với tham số là mockLoanContractRequest không
      expect(loanContractRequestRepositoryMock.save).toHaveBeenCalledWith({
        ...mockLoanContractRequest,
        status: LoanContractRequestStatus.paid,
      });

      // Kiểm tra xem trạng thái của loan contract request đã được cập nhật thành waiting_for_lender_payment hay chưa
      expect(mockLoanContractRequest.status).toEqual(LoanContractRequestStatus.paid);
    });

    //Loan contract request is not waiting for lender payment
    it('should throw error if loan contract request is not waiting for lender payment', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_borrower_confirmation,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(
        loanContractRequestService.lenderPayLoanContractRequest('sampleId', 'senderId'),
      ).rejects.toThrowError(new AppError('Loan contract request is not waiting for lender payment', 400));
    });

    //You are not lender of this loan contract request
    it('should throw error if user is not lender of the loan contract request', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        lender_id: 'lenderId',
        status: LoanContractRequestStatus.waiting_for_lender_payment,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(
        loanContractRequestService.lenderPayLoanContractRequest('sampleId', 'nonLenderId'),
      ).rejects.toThrowError(new AppError('You are not lender of this loan contract request', 400));
    });
  });

  describe('rejectLoanContractRequest', () => {
    beforeEach(() => {
      loanContractRequestRepositoryMock = {} as Repository<LoanContractRequest>;
      dataSourceMock = {} as DataSource;

      loanContractRequestRepositoryMock.findOne = jest.fn();
      loanContractRequestRepositoryMock.save = jest.fn();

      dataSourceMock.getRepository = jest.fn(() => loanContractRequestRepositoryMock) as any;
      loanContractRequestRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
      });

      loanContractRequestService = new LoanContractRequestService(dataSourceMock);
    });

    it('should reject loan contract request if it exists and user is lender', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.waiting_for_lender_payment,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };

      // Giả lập phương thức findOne trả về mockLoanContract
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);

      await loanContractRequestService.rejectLoanContractRequest('sampleId', 'senderId');

      expect(loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError).toHaveBeenCalledWith(
        'sampleId',
        'senderId',
      );

      expect(loanContractRequestRepositoryMock.save).toHaveBeenCalledWith({
        ...mockLoanContractRequest,
        status: LoanContractRequestStatus.lender_rejected,
      });

      expect(mockLoanContractRequest.status).toEqual(LoanContractRequestStatus.lender_rejected);
    });

    //Loan contract request is already paid
    it('should throw error if loan contract request is already paid', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.paid,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(loanContractRequestService.rejectLoanContractRequest('sampleId', 'senderId')).rejects.toThrowError(
        new AppError('Loan contract request is already paid', 400),
      );
    });

    //Loan contract request is already rejected

    it('should throw error if loan contract request is already rejected', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        status: LoanContractRequestStatus.lender_rejected,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(loanContractRequestService.rejectLoanContractRequest('sampleId', 'senderId')).rejects.toThrowError(
        new AppError('Loan contract request is already rejected', 400),
      );
    });

    //'Lender has approved this loan contract request, you cannot reject it. Please contact lender to cancel this loan contract request'
    it('should throw error if lender has approved this loan contract request', async () => {
      const mockLoanContractRequest = {
        id: 'sampleId',
        sender_id: 'senderId',
        receiver_id: 'receiverId',
        lender_id: 'senderId',
        status: LoanContractRequestStatus.waiting_for_lender_payment,
        type: LoanContractRequestTypes.lending,
        loan_amount: 1000,
        interest_rate: 0.05,
        loan_tenure_months: 12,
        lender_approved_at: new Date(),
        loan_reason_type: LoanReasonTypes.business,
        reason_for_loan: 'Expanding business',
        notes: 'Additional notes',
      };
      loanContractRequestService.checkLoanContractRequestExistByIdAndUserOrThrowError = jest
        .fn()
        .mockResolvedValue(mockLoanContractRequest);
      await expect(loanContractRequestService.rejectLoanContractRequest('sampleId', 'receiverId')).rejects.toThrowError(
        new AppError(
          'Lender has approved this loan contract request, you cannot reject it. Please contact lender to cancel this loan contract request',
          400,
        ),
      );
    });
  });
});
