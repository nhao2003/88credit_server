import { validate } from '../../src/utils/validation';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../../src/models/Error';

jest.mock('express-validator');

describe('validate', () => {
  const req = {} as Request;
  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call next if validation succeeds', async () => {
    const validation = {
      run: jest.fn().mockResolvedValue(undefined),
    };

    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValueOnce(true),
    });

    await validate(validation as any)(req, res, next);

    expect(validation.run).toHaveBeenCalledWith(req);
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
  });

  it('should call next with an AppError if validation fails', async () => {
    const validation = {
      run: jest.fn().mockResolvedValue(undefined),
    };

    const errors = {
      isEmpty: jest.fn().mockReturnValueOnce(false),
      array: jest.fn().mockReturnValueOnce([
        {
          msg: 'Invalid email',
          path: 'email',
          value: 'invalid-email',
        },
      ]),
    };

    (validationResult as unknown as jest.Mock).mockReturnValueOnce(errors);

    await validate(validation as any)(req, res, next);
    expect(validation.run).toHaveBeenCalledWith(req);
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(errors.array).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new AppError('Invalid Request Body', 401, [
        {
          message: 'Invalid email',
          path: 'email',
          value: 'invalid-email',
        },
      ]),
    );
  });
});
