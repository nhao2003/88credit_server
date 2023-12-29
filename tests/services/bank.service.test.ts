import { Repository } from 'typeorm';
import BankService from '../../src/services/bank.service';
import BankCard from '../../src/models/databases/BankCard';
import Bank from '../../src/models/databases/Bank';
describe('BankService', () => {
  let bankService: BankService;
  let bankCardRepository: Repository<BankCard>;
  let bankRepository: Repository<Bank>;
  let dataSource: any;
  beforeEach(() => {
    // Mock the dependencies

    dataSource = {
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === Bank) {
          return bankRepository;
        } else if (entity === BankCard) {
          return bankCardRepository;
        }
      }),
    } as any;
    bankService = new BankService(dataSource);
  });

  describe('getAllBank', () => {
    it('should return all banks', async () => {
      // Mock the bankRepository.find() method
      // bankRepository.find = jest.fn().mockResolvedValueOnce(['Bank 1', 'Bank 2']);
      bankRepository = {
        find: jest.fn().mockResolvedValueOnce(['Bank 1', 'Bank 2']),
      } as any;
      bankService = new BankService(dataSource);
      const result = await bankService.getAllBank();

      expect(result).toEqual(['Bank 1', 'Bank 2']);
      expect(bankRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return cached banks if available', async () => {
      // Set the banks property to a non-empty array
      const cachedBanks: Bank[] = [{ id: '1', name: 'Cached Bank' } as any];
      bankRepository.find = jest.fn().mockResolvedValueOnce(cachedBanks);

      const result = await bankService.getAllBank();
      const result2 = await bankService.getAllBank();

      expect(result).toEqual(cachedBanks);
      expect(result2).toEqual(cachedBanks);
      expect(bankRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a bank by id', async () => {
      // Mock the bankRepository.findOne() method
      bankRepository.findOne = jest.fn().mockResolvedValueOnce('Bank 1');

      const result = await bankService.getById('1');

      expect(result).toEqual('Bank 1');
      expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return a bank from cache if available', async () => {
      // Set the banks property to contain a bank with the given id
      bankService['banks'] = [{ id: '1', name: 'Cached Bank' } as any];

      const result = await bankService.getById('1');
      bankRepository.findOne = jest.fn().mockResolvedValueOnce('Bank 1');

      expect(result).toEqual({ id: '1', name: 'Cached Bank' });
      expect(bankRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null if bank is not found', async () => {
      // Set the banks property to an empty array
      bankService = new BankService(dataSource);

      bankRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);
      const result = await bankService.getById('1');

      expect(result).toBe(undefined);
      expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('checkValidAccount', () => {
    it('should return status true and message "Valid bank account number" if account number is valid', async () => {
      // Mock the getById() method
      bankService.getById = jest.fn().mockResolvedValueOnce({ bin: '1234' });

      const result = await bankService.checkValidAccount('1', '1234567890');

      expect(result).toEqual({ status: true, message: 'Valid bank account number' });
      expect(bankService.getById).toHaveBeenCalledWith('1');
    });

    it('should return status false and message "Invalid bank account number" if account number is invalid', async () => {
      // Mock the getById() method
      bankService.getById = jest.fn().mockResolvedValueOnce({ bin: '1234' });

      const result = await bankService.checkValidAccount('1', '9876543210');

      expect(result).toEqual({ status: false, message: 'Invalid bank account number' });
      expect(bankService.getById).toHaveBeenCalledWith('1');
    });

    it('should return status false and message "Invalid bank id" if bank id is invalid', async () => {
      // Mock the getById() method to throw an error
      bankService.getById = jest.fn().mockRejectedValueOnce(new Error('Invalid bank id'));

      const result = await bankService.checkValidAccount('invalid', '1234567890');

      expect(result).toEqual({ status: false, message: 'Invalid bank id' });
      expect(bankService.getById).toHaveBeenCalledWith('invalid');
    });

    it('should return status false and message "Bank not found" if bank is not found', async () => {
      // Mock the getById() method to return null
      bankService.getById = jest.fn().mockResolvedValueOnce(null);

      const result = await bankService.checkValidAccount('1', '1234567890');

      expect(result).toEqual({ status: false, message: 'Bank not found' });
      expect(bankService.getById).toHaveBeenCalledWith('1');
    });
  });

  // Add more test cases for the remaining methods...
});
