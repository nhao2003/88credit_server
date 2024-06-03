import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';

export const RpcHeader = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx: RpcArgumentsHost = context.switchToRpc();
    const headers = ctx.getContext().getData().headers;
    return data ? headers[data] : headers;
  },
);
