import jwt, { JwtPayload } from 'jsonwebtoken';
import ServerCodes from '~/constants/server_codes';
import { AppError } from '~/models/Error';

export interface UserPayload extends JwtPayload {
  user_id: string;
  session_id: string;
}

export interface VerifyResult {
  payload: UserPayload | JwtPayload | string | undefined;
  expired: boolean;
}

export const signToken = ({
  payload,
  expiresIn,
  secretKey = process.env.JWT_SECRET_KEY as string,
}: {
  payload: string | Buffer | object;
  expiresIn: string | number;
  secretKey?: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      secretKey,
      {
        algorithm: 'HS256',
        expiresIn,
      },
      (error: Error | null, token: string | undefined) => {
        if (error) {
          reject(new AppError(500, error.message, { serverCode: ServerCodes.CommomCode.InternalServerError }));
        } else if (!token) {
          reject(new AppError(500, 'Token is undefined', { serverCode: ServerCodes.CommomCode.InternalServerError }));
        } else {
          resolve(token);
        }
      },
    );
  });
};

export function verifyToken(token: string, secretKey: string = process.env.JWT_SECRET_KEY as string) {
  return new Promise<VerifyResult>((resolve) => {
    jwt.verify(token, secretKey, (error, payload) => {
      resolve({ payload: payload, expired: error?.name === 'TokenExpiredError' });
    });
  });
}
