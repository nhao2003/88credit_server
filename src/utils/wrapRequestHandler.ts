import { Response, Request, NextFunction, RequestHandler } from 'express';

export function wrapRequestHandler(handler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error('Catch in wrapRequestHandler:');
      console.error(error);
      next(error);
    }
  };
}
