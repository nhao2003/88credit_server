import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';

export const RpcParam = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const params = ctx.getData().params;
    return data ? params[data] : params;
  },
);
