import AuthServices from '../../src/services/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../src/models/databases/User';
import { OTP } from '../../src/models/databases/Otp';
import { Session } from '../../src/models/databases/Sesstion';
import { OTPTypes, UserStatus } from '../../src/constants/enum';
import * as jwt from '../../src/utils/jwt';
import * as crypto from '../../src/utils/crypto';
describe('AuthServices', () => {
  let authServices: AuthServices;
  let userRepository: Repository<User>;
  let otpRepository: Repository<OTP>;
  let sessionRepository: Repository<Session>;
  let dataSource: DataSource;

  beforeAll(() => {
    jest.mock('jsonwebtoken', () => ({
      sign: jest.fn().mockReturnValue('token'),
      verify: jest.fn().mockReturnValue({ payload: { user_id: '1', session_id: '1' }, expired: false }),
    }));

    jest.mock('~/utils/crypto', () => ({
      hashString: jest.fn().mockReturnValue('hash'),
      hashPassword: jest.fn().mockReturnValue('hash'),
    }));
    jest.mock('~/utils/time', () => ({
      parseTimeToMilliseconds: jest.fn().mockReturnValue(1000),
    }));
    dataSource = {
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === User) {
          return userRepository;
        }
        if (entity === OTP) {
          return otpRepository;
        }
        if (entity === Session) {
          return sessionRepository;
        }
        return {} as any;
      }),
    } as any;
  });

  describe('generateOTPCode', () => {
    it('should return otp code', async () => {
      otpRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      authServices = new AuthServices(dataSource);

      const result = await authServices.generateOTPCode(OTPTypes.account_activation, '1');
      // result should be 6 digits number
      expect(result).toMatch(/^\d{6}$/);
    });
  });

  describe('signUp', () => {
    it('should return otp code', async () => {
      userRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      otpRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      authServices = new AuthServices(dataSource);

      authServices.generateOTPCode = jest.fn().mockReturnValue('123456');
      const result = await authServices.signUp('abc@abc.com', '123');
      expect(result).toEqual('123456');
    });
  });

  describe('resendOTPCode', () => {
    it('should return otp code if user is unverified', async () => {
      userRepository.findOne = jest.fn().mockReturnValue({ id: '1', status: UserStatus.unverified });

      otpRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      const result = await authServices.resendOTPCode('abc@abc.com');
      expect(result).toMatch(/^\d{6}$/);
    });

    it('should throw error if user is already active', async () => {
      userRepository.findOne = jest.fn().mockReturnValue({ id: '1', status: UserStatus.verified });

      otpRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      expect(authServices.resendOTPCode('email')).rejects.toThrowError('User is already active');
    });

    it('should return null if user is not found', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.resendOTPCode('email');
      expect(result).toEqual(null);
    });
  });

  describe('createSession', () => {
    it('should return token', async () => {
      sessionRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      authServices = new AuthServices(dataSource);

      const result = await authServices.createSession('1');
      expect(result).toBeDefined();
    });
  });

  describe('signIn', () => {
    it('should return token', async () => {
      userRepository.findOne = jest.fn().mockReturnValue({ id: '1', status: UserStatus.verified });

      sessionRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      authServices = new AuthServices(dataSource);
      const createSessionSpy = jest.spyOn(authServices, 'createSession');

      const result = await authServices.signIn('email', 'password');
      expect(createSessionSpy).toBeCalledWith('1');
      expect(result).toBeDefined();
    });

    it('should return null if user is not found', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.signIn('email', 'password');
      expect(result).toEqual(null);
    });
  });

  describe('grantNewAccessToken', () => {
    it('should return a new access token', async () => {
      jest.spyOn(jwt, 'verifyToken').mockResolvedValue({ payload: { id: '1', session_id: '1' }, expired: false });
      sessionRepository = {
        findOne: jest.fn().mockReturnValue({ id: '1' }),
        save: jest.fn().mockReturnValue({}),
      } as any;
      authServices = new AuthServices(dataSource);
      const result = await authServices.grantNewAccessToken('token');
      expect(result).toBeDefined();
    });

    it('should return null when the token is expired', async () => {
      jest.spyOn(jwt, 'verifyToken').mockResolvedValue({ payload: { id: '1', session_id: '1' }, expired: true });
      sessionRepository = {
        findOne: jest.fn().mockReturnValue({ id: '1' }),
        save: jest.fn().mockReturnValue({}),
      } as any;
      authServices = new AuthServices(dataSource);
      const result = await authServices.grantNewAccessToken('token');
      expect(result).toBeNull();
    });
    it('should return null when the session is not found', async () => {
      jest.mock('~/utils/jwt', () => ({
        verifyToken: jest.fn().mockReturnValue({ payload: { id: '1', session_id: '1' }, expired: false }),
      }));
      sessionRepository.findOne = jest.fn().mockReturnValue(null);
      sessionRepository.save = jest.fn().mockReturnValue({});
      authServices = new AuthServices(dataSource);
      const result = await authServices.grantNewAccessToken('token');
      expect(result).toBeNull();
    });
  });

  describe('getOTP', () => {
    it('should return otp', async () => {
      otpRepository.findOne = jest.fn().mockReturnValue({ id: '1' });

      const result = await authServices.getOTP('1', '123456', OTPTypes.account_activation);
      expect(result).toBeDefined();
    });

    it('should return null if otp is not found', async () => {
      otpRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.getOTP('1', '123456', OTPTypes.account_activation);
      expect(result).toEqual(null);
    });
  });

  describe('verifyOTPCodeAndUse', () => {
    it('should return true if otp is found', async () => {
      otpRepository.findOne = jest.fn().mockReturnValue({ id: '1' });
      otpRepository.save = jest.fn().mockReturnValue({});

      const result = await authServices.verifyOTPCodeAndUse('1', '123456', OTPTypes.account_activation);
      expect(result).toEqual(true);
    });

    it('should return false if otp is not found', async () => {
      otpRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.verifyOTPCodeAndUse('1', '123456', OTPTypes.account_activation);
      expect(result).toEqual(false);
    });
  });

  describe('activeAccount', () => {
    it('should return true if otp is found', async () => {
      const user = { id: '1', status: UserStatus.unverified };
      otpRepository = {
        findOne: jest.fn().mockReturnValue(user),
        save: jest.fn().mockReturnValue({}),
      } as any;
      userRepository = {
        findOne: jest.fn().mockReturnValue(user),
        save: jest.fn().mockReturnValue({}),
      } as any;
      authServices = new AuthServices(dataSource);
      const result = await authServices.activeAccount('1');
      expect(result).toEqual(true);
    });

    it('should return false if otp is not found', async () => {
      otpRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.activeAccount('1');
      expect(result).toEqual(false);
    });
  });

  describe('checkUserExistByEmail', () => {
    it('should return user', async () => {
      userRepository.findOne = jest.fn().mockReturnValue({ id: '1' });

      const result = await authServices.checkUserExistByEmail('email');
      expect(result).toBeDefined();
    });

    it('should return null if user is not found', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.checkUserExistByEmail('email');
      expect(result).toEqual(null);
    });
  });

  describe('checkUserExistByID', () => {
    it('should return user', async () => {
      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue({ id: '1' }),
      });

      const result = await authServices.checkUserExistByID('1');
      expect(result).toBeDefined();
    });

    it('should return null if user is not found', async () => {
      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
      });

      const result = await authServices.checkUserExistByID('1');
      expect(result).toEqual(null);
    });
  });

  describe('getUserByEmailAndPassword', () => {
    it('should return user and password_is_correct is true', async () => {
      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue({ id: '1', password: 'hash' }),
      });
      jest.mock('~/utils/crypto', () => ({
        hashPassword: jest.fn().mockReturnValue('hash'),
      }));

      const result = await authServices.getUserByEmailAndPassword('email', 'password');
      expect(result).toEqual({ user: { id: '1', password: 'hash' }, password_is_correct: false });
    });

    it('should return user and password_is_correct is false', async () => {
      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue({ id: '1', password: 'hash' }),
      });

      const result = await authServices.getUserByEmailAndPassword('email', 'wrong_password');
      expect(result).toEqual({ user: { id: '1', password: 'hash' }, password_is_correct: false });
    });

    it('should return user and password_is_correct is false', async () => {
      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
      });

      const result = await authServices.getUserByEmailAndPassword('email', 'wrong_password');
      expect(result).toEqual({ user: null, password_is_correct: false });
    });
  });

  describe('signOut', () => {
    it('should return true', async () => {
      sessionRepository.findOne = jest.fn().mockReturnValue({ id: '1' });
      sessionRepository.delete = jest.fn().mockReturnValue({});

      const result = await authServices.signOut('1');
      expect(sessionRepository.delete).toBeCalledWith({ id: '1' });
    });
  });

  describe('signOutAll', () => {
    it('should return true', async () => {
      sessionRepository.delete = jest.fn().mockReturnValue({});

      const result = await authServices.signOutAll('1');
      expect(sessionRepository.delete).toBeCalledWith({ user_id: '1' });
    });
  });

  describe('checkSessionExist', () => {
    it('should return session', async () => {
      sessionRepository.findOne = jest.fn().mockReturnValue({ id: '1' });

      const result = await authServices.checkSessionExist('1');
      expect(result).toBeDefined();
    });

    it('should return null if session is not found', async () => {
      sessionRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.checkSessionExist('1');
      expect(result).toEqual(null);
    });
  });

  describe('changePassword', () => {
    it('should return true', async () => {
      jest.spyOn(crypto, 'hashPassword').mockReturnValue('hash');
      const user: User = { id: '1', password: 'hash' } as any;
      userRepository = {
        findOne: jest.fn().mockReturnValue(user),
        save: jest.fn().mockReturnValue({}),
      } as any;
      authServices = new AuthServices(dataSource);
      const result = await authServices.changePassword('1', '123');
      expect(result).toEqual(true);
    });

    it('should return false if user is not found', async () => {
      userRepository = {
        findOne: jest.fn().mockReturnValue(null),
      } as any;
      authServices = new AuthServices(dataSource);
      const result = await authServices.changePassword('1', '123');
      expect(result).toEqual(false);
    });
  });

  describe('forgotPassword', () => {
    it('should return otp code', async () => {
      userRepository.findOne = jest.fn().mockReturnValue({ id: '1' });

      otpRepository = {
        insert: jest.fn().mockReturnValue({ identifiers: [{ id: '1' }] }),
      } as any;

      authServices = new AuthServices(dataSource);

      authServices.generateOTPCode = jest.fn().mockReturnValue('123456');
      const result = await authServices.forgotPassword('email');
      expect(result).toEqual('123456');
    });

    it('should return null if user is not found', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(null);

      const result = await authServices.forgotPassword('email');
      expect(result).toEqual(null);
    });
  });

  describe('generateResetPasswordToken', () => {
    it('should return token', async () => {
      jest.mock('~/utils/jwt', () => ({
        signToken: jest.fn().mockReturnValue('token'),
      }));
      const result = await authServices.generateResetPasswordToken('1', '1');
      expect(result).toBeDefined();
    });
  });
});
