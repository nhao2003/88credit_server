import jwt from 'jsonwebtoken';
import { signToken } from '../../src/utils/jwt';
import { AppError } from '../../src/models/Error';
import { verifyToken } from '../../src/utils/jwt';
jest.mock('jsonwebtoken');

describe('signToken', () => {
  const payload = { userId: 123 };
  const expiresIn = '1h';
  const secretKey = 'test_secret_key';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should resolve with a token when signing succeeds', async () => {
    const expectedToken = 'test_token';
    (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => {
      cb(null, expectedToken);
    });

    const result = await signToken({ payload, expiresIn, secretKey });

    expect(result).toEqual(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, { algorithm: 'HS256', expiresIn }, expect.any(Function));
  });

  it('should reject with an AppError when signing fails', async () => {
    const expectedError = new Error('test_error');
    (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => {
      cb(expectedError, undefined);
    });

    await expect(signToken({ payload, expiresIn, secretKey })).rejects.toThrow();
    expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, { algorithm: 'HS256', expiresIn }, expect.any(Function));
  });

  it('should reject with an AppError when token is not returned', async () => {
    (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => {
      cb(null, undefined);
    });

    await expect(signToken({ payload, expiresIn, secretKey })).rejects.toThrow();
    expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, { algorithm: 'HS256', expiresIn }, expect.any(Function));
  });

  describe('verifyToken', () => {
    const token = 'test_token';
    const secretKey = 'test_secret_key';

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should resolve with a payload when verification succeeds', async () => {
      const expectedPayload = { userId: 123 };
      (jwt.verify as jest.Mock).mockImplementationOnce((_, __, cb) => {
        cb(null, expectedPayload);
      });

      const result = await verifyToken(token, secretKey);

      expect(result.payload).toEqual(expectedPayload);
      expect(result.expired).toBeFalsy();
      expect(jwt.verify).toHaveBeenCalledWith(token, secretKey, expect.any(Function));
    });

    it('should resolve with expired=true when token is expired', async () => {
      (jwt.verify as jest.Mock).mockImplementationOnce((_, __, cb) => {
        cb({ name: 'TokenExpiredError' }, undefined);
      });

      const result = await verifyToken(token, secretKey);

      expect(result.payload).toBeUndefined();
      expect(result.expired).toBeTruthy();
      expect(jwt.verify).toHaveBeenCalledWith(token, secretKey, expect.any(Function));
    });
  });

  describe('signToken', () => {
    const payload = { userId: 1 };
    const expiresIn = '1h';
    const secretKey = 'secret';

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should resolve with a token when signing is successful', async () => {
      const token = 'token';
      (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => cb(null, token));

      const result = await signToken({ payload, expiresIn, secretKey });

      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        secretKey,
        { algorithm: 'HS256', expiresIn },
        expect.any(Function),
      );
    });

    it('should reject with an AppError when signing fails', async () => {
      const error = new Error('Signing failed');
      (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => cb(error, undefined));

      await expect(signToken({ payload, expiresIn, secretKey })).rejects.toThrow();
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        secretKey,
        { algorithm: 'HS256', expiresIn },
        expect.any(Function),
      );
    });

    it('should reject with an AppError when token is not returned', async () => {
      (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => cb(null, undefined));

      await expect(signToken({ payload, expiresIn, secretKey })).rejects.toThrow();
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        secretKey,
        { algorithm: 'HS256', expiresIn },
        expect.any(Function),
      );
    });

    it('should sign with default secret key if not provided', async () => {
      (jwt.sign as jest.Mock).mockImplementationOnce((_, __, ___, cb) => cb(null, 'token'));

      await signToken({ payload, expiresIn });

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.JWT_SECRET_KEY as string,
        { algorithm: 'HS256', expiresIn },
        expect.any(Function),
      );
    });

    it('should verify with default secret key if not provided', async () => {
      (jwt.verify as jest.Mock).mockImplementationOnce((_, __, cb) => cb(null, payload));

      await verifyToken('token');

      expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET_KEY as string, expect.any(Function));
    });
  });
});
