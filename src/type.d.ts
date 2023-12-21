import { Verify } from 'crypto';
import { Request } from 'express';
import { User } from './domain/databases/entity/User';
import { Session } from './domain/databases/entity/Sesstion';
import AppResponse from './models/typing/AppRespone';

declare module 'express' {
  interface Request {
    user?: User;
    session?: Session;
    verifyResult?: VerifyResult;
    verifyResultRefreshToken?: VerifyResult;
  }
  interface Response {
    json(data: AppResponse): Response;
  }
}
