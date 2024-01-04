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


describe('BankService', () => {
  let bankService: BankService;
  let bankCardRepository: Repository<BankCard>;
  let bankRepository: Repository<Bank>;
  let dataSource: any;

  beforeEach(() => {
    // Mock the dependencies
    bankCardRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    bankRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as any;

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
      // bankRepository.find.mockResolvedValueOnce(['Bank 1', 'Bank 2']);
      bankRepository.find = jest.fn().mockResolvedValueOnce(['Bank 1', 'Bank 2']);

      const result = await bankService.getAllBank();

      expect(result).toEqual(['Bank 1', 'Bank 2']);
      expect(bankRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return cached banks if available', async () => {
      // Set the banks property to a non-empty array
      bankService['banks'] = [{ id: '1', name: 'Cached Bank' } as any];

      const result = await bankService.getAllBank();

      expect(result).toEqual([{ id: '1', name: 'Cached Bank' }]);
      expect(bankRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a bank by id', async () => {
      // Mock the bankRepository.findOne() method
      // bankRepository.findOne.mockResolvedValueOnce('Bank 1');
      bankRepository.findOne = jest.fn().mockResolvedValueOnce('Bank 1');


      const result = await bankService.getById('1');

      expect(result).toEqual('Bank 1');
      expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return a bank from cache if available', async () => {
      // Set the banks property to contain a bank with the given id
      bankService['banks'] = [{ id: '1', name: 'Cached Bank' } as any];

      const result = await bankService.getById('1');

      expect(result).toEqual({ id: '1', name: 'Cached Bank' });
      expect(bankRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null if bank is not found', async () => {
      // bankRepository.findOne.mockResolvedValueOnce(undefined);
      bankRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await bankService.getById('1');

      expect(result).toBe(undefined);
      expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('checkValidAccount', () => {
    beforeEach(() => {
      bankService.getById = jest.fn();
    });

    it('should return status true and message "Valid bank account number" if account number is valid', async () => {
      // bankService.getById.mockResolvedValueOnce({ bin: '1234' });
      bankService.getById = jest.fn().mockResolvedValueOnce({ bin: '1234' });

      const result = await bankService.checkValidAccount('1', '1234567890');

      expect(result).toEqual({ status: true, message: 'Valid bank account number' });
      expect(bankService.getById).toHaveBeenCalledWith('1');
    });

    it('should return status false and message "Invalid bank account number" if account number is invalid', async () => {
      // bankService.getById.mockResolvedValueOnce({ bin: '1234' });
      bankService.getById = jest.fn().mockResolvedValueOnce({ bin: '1234' });

      const result = await bankService.checkValidAccount('1', '9876543210');

      expect(result).toEqual({ status: false, message: 'Invalid bank account number' });
      expect(bankService.getById).toHaveBeenCalledWith('1');
    });

    it('should return status false and message "Invalid bank id" if bank id is invalid', async () => {
      // bankService.getById.mockRejectedValueOnce(new Error('Invalid bank id'));
      bankService.getById = jest.fn().mockRejectedValueOnce(new Error('Invalid bank id'));

      const result = await bankService.checkValidAccount('invalid', '1234567890');

      expect(result).toEqual({ status: false, message: 'Invalid bank id' });
      expect(bankService.getById).toHaveBeenCalledWith('invalid');
    });

    it('should return status false and message "Bank not found" if bank is not found', async () => {
      // bankService.getById.mockResolvedValueOnce(null);
      bankService.getById = jest.fn().mockResolvedValueOnce(null);

      const result = await bankService.checkValidAccount('1', '1234567890');

      expect(result).toEqual({ status: false, message: 'Bank not found' });
      expect(bankService.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('addBankCard', () => {
    it('should add a bank card', async () => {
      const data = {
        bank_id: '1',
        card_number: '1234567890',
        user_id: 'user1',
        branch: 'Branch 1',
      };

      bankService.checkValidAccount = jest.fn().mockResolvedValueOnce({ status: true, message: 'Valid bank account number' });
      // bankCardRepository.findOne.mockResolvedValueOnce(null);
      // bankCardRepository.create.mockReturnValueOnce(data);
      // bankCardRepository.save.mockResolvedValueOnce(data);
      bankCardRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      bankCardRepository.create = jest.fn().mockReturnValueOnce(data);
      bankCardRepository.save = jest.fn().mockResolvedValueOnce(data);
      bankCardRepository.upsert = jest.fn().mockResolvedValueOnce(data);

      const result = await bankService.addBankCard(data);

      expect(result.bank_id).toEqual('1');
      expect(bankService.checkValidAccount).toHaveBeenCalledWith('1', '1234567890');
      expect(bankCardRepository.findOne).toHaveBeenCalledWith({ where: { user_id: 'user1' } });
      expect(bankCardRepository.create).not.toHaveBeenCalled();
      expect(bankCardRepository.save).toHaveBeenCalledWith(data);
    });

    it('should throw an error if bank account number is invalid', async () => {
      const data = {
        bank_id: '1',
        card_number: '1234567890',
        user_id: 'user1',
        branch: 'Branch 1',
      };

      bankService.checkValidAccount = jest.fn().mockResolvedValueOnce({ status: false, message: 'Invalid bank account number' });

      await expect(bankService.addBankCard(data)).rejects.toThrowError('Invalid bank account number');
      expect(bankService.checkValidAccount).toHaveBeenCalledWith('1', '1234567890');
      expect(bankCardRepository.findOne).not.toHaveBeenCalled();
      expect(bankCardRepository.create).not.toHaveBeenCalled();
      expect(bankCardRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getAllBankCard', () => {
    it('should return all bank cards for a user', async () => {
      const user_id = 'user1';
      const bankCards = [{ id: '1', card_number: '1234567890' }, { id: '2', card_number: '0987654321' }];

      // bankCardRepository.createQueryBuilder.mockReturnValueOnce({
      //   leftJoinAndSelect: jest.fn().mockReturnThis(),
      //   where: jest.fn().mockReturnThis(),
      //   andWhere: jest.fn().mockReturnThis(),
      //   getMany: jest.fn().mockResolvedValueOnce(bankCards),
      // });
      bankCardRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(bankCards),
      });

      const result = await bankService.getAllBankCard(user_id);

      expect(result).toEqual(bankCards);
      expect(bankCardRepository.createQueryBuilder).toHaveBeenCalledWith('bank_card');
      expect(bankCardRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('bank_card.bank', 'bank');
      expect(bankCardRepository.createQueryBuilder().where).toHaveBeenCalledWith('bank_card.user_id = :user_id', { user_id });
      expect(bankCardRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('bank_card.deleted_at IS NULL');
      expect(bankCardRepository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBankCardById', () => {
    it('should return a bank card by id', async () => {
      const id = '1';
      const bankCard = { id: '1', card_number: '1234567890' };

      // bankCardRepository.findOne.mockResolvedValueOnce(bankCard);
      bankCardRepository.findOne = jest.fn().mockResolvedValueOnce(bankCard);

      const result = await bankService.getBankCardById(id);

      expect(result).toEqual(bankCard);
      expect(bankCardRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('deleteBankCard', () => {
    it('should delete a bank card', async () => {
      const id = '1';
      const bankCard = { id: '1', card_number: '1234567890' };

      // bankCardRepository.findOne.mockResolvedValueOnce(bankCard);
      bankCardRepository.findOne = jest.fn().mockResolvedValueOnce(bankCard);

      await bankService.deleteBankCard(id);

      expect(bankCardRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(bankCardRepository.softDelete).toHaveBeenCalledWith(id);
    });

    it('should throw an error if bank card is not found', async () => {
      const id = '1';

      // bankCardRepository.findOne.mockResolvedValueOnce(undefined);
      bankCardRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);

      await expect(bankService.deleteBankCard(id)).rejects.toThrowError('Not Found');
      expect(bankCardRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(bankCardRepository.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('updateBankAccount', () => {
    it('should update the bank account', async () => {
      const user_id = 'user1';
      const bank_account_id = '1';
      const bankAccount = { id: '1', card_number: '1234567890' };

      // bankCardRepository.findOne.mockResolvedValueOnce(bankAccount);
      // bankCardRepository.update.mockResolvedValueOnce(undefined);
      bankCardRepository.findOne = jest.fn().mockResolvedValueOnce(bankAccount);
      bankCardRepository.update = jest.fn().mockResolvedValueOnce(undefined);

      await bankService.updateBankAccount(user_id, bank_account_id);

      expect(bankCardRepository.findOne).toHaveBeenCalledWith({ where: { id: bank_account_id, user_id } });
      expect(bankCardRepository.update).toHaveBeenCalledWith({ user_id }, { is_primary: false });
      expect(bankCardRepository.update).toHaveBeenCalledWith({ id: bank_account_id }, { is_primary: true });
    });

    it('should throw an error if bank account is not found', async () => {
      const user_id = 'user1';
      const bank_account_id = '1';

      // bankCardRepository.findOne.mockResolvedValueOnce(undefined);
      bankCardRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);

      await expect(bankService.updateBankAccount(user_id, bank_account_id)).rejects.toThrowError('Not Found');
      expect(bankCardRepository.findOne).toHaveBeenCalledWith({ where: { id: bank_account_id, user_id } });
      expect(bankCardRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('getPrimaryBankCard', () => {
    it('should return the primary bank card for a user', async () => {
      const user_id = 'user1';
      const bankCard = { id: '1', card_number: '1234567890' };

      // bankCardRepository.createQueryBuilder.mockReturnValueOnce({
      //   leftJoinAndSelect: jest.fn().mockReturnThis(),
      //   where: jest.fn().mockReturnThis(),
      //   andWhere: jest.fn().mockReturnThis(),
      //   getOne: jest.fn().mockResolvedValueOnce(bankCard),
      // });

      bankCardRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(bankCard),
      });

      const result = await bankService.getPrimaryBankCard(user_id);

      expect(result).toEqual(bankCard);
      expect(bankCardRepository.createQueryBuilder).toHaveBeenCalledWith('bank_card');
      expect(bankCardRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('bank_card.bank', 'bank');
      expect(bankCardRepository.createQueryBuilder().where).toHaveBeenCalledWith('bank_card.user_id = :user_id', { user_id });
      expect(bankCardRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('bank_card.is_primary = true');
      expect(bankCardRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('bank_card.deleted_at IS NULL');
      expect(bankCardRepository.createQueryBuilder().getOne).toHaveBeenCalledTimes(1);
    });
  });
});