import { NextFunction } from 'express';
import { wrapRequestHandler } from '../../src/utils/wrapRequestHandler';

describe('wrapRequestHandler', () => {
  it('should call the original handler with the correct arguments', async () => {
    // Arrange
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const originalHandler = jest.fn().mockResolvedValue(undefined);
    const wrappedHandler = wrapRequestHandler(originalHandler);

    // Act
    await wrappedHandler(mockRequest as any, mockResponse as any, mockNext as any);

    // Assert
    expect(originalHandler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
  });

  it('should call next with an error if the original handler throws an error', async () => {
    // Arrange
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const error = new Error('Test error');
    const originalHandler = jest.fn().mockRejectedValue(error);
    const wrappedHandler = wrapRequestHandler(originalHandler);

    // Act
    await wrappedHandler(mockRequest as any, mockResponse as any, mockNext as any);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  // Add more test cases as needed
});
