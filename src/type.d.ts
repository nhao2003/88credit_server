import { Verify } from 'crypto';
import { Request } from 'express';
import { User } from './domain/databases/entity/User';
import { Session } from './domain/databases/entity/Sesstion';
declare module 'express' {
  interface Request {
    user?: User;
    session?: Session;
    verifyResult?: VerifyResult;
    verifyResultRefreshToken?: VerifyResult;
  }

  interface Response {
    json(data: { status: 'success' | 'error' | 'fail'; code: number; message: string; result?: any }): Response;
  }
}
