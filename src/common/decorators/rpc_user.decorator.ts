import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import e from 'express';

export const RpcUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const user = ctx.getData().user;
    return data ? user[data] : user;
  },
);

export const RpcUserId = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const user = ctx.getData().user;
    return user.userId;
  },
);
