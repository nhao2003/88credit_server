import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { isMongoId, isUUID } from 'class-validator';

export const GetParamId = createParamDecorator(
  (
    data: {
      param: string;
      type: 'uuid' | 'ObjectId' | 'number';
    } = { param: 'id', type: 'uuid' },
    context: ExecutionContext,
  ) => {
    const { param, type } = data;
    const request = context.switchToHttp().getRequest();
    const id = request.params[param];
    let isValid = false;
    if (type === 'uuid') {
      isValid = isUUID(id);
    } else if (type === 'ObjectId') {
      isValid = isMongoId(id);
    } else if (type === 'number') {
      isValid = !isNaN(id);
    }
    if (!isValid) {
      throw new BadRequestException('${param} is not a valid ${type}');
    }
    return id;
  },
);
