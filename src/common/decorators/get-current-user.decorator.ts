import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'src/app/auth/types/jwt-payload.types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    console.log('data', data);
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) {
      console.log('user', user);
      throw new UnauthorizedException();
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
