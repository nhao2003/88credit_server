import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import {
  CreatePostDto,
  CreatePostWithUserIdDto,
} from '../dtos/post-pay-load.dto';
import { $Enums } from '@prisma/client';

export const CheckValidPost = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CreatePostWithUserIdDto => {
    const request = ctx.switchToHttp().getRequest();
    const post: CreatePostWithUserIdDto = request.body;

    if (post.type === $Enums.PostTypes.lending) {
      if (post.maxAmount === null || post.maxAmount === undefined) {
        throw new Error('maxAmount is required for lease post');
      } else if (post.maxDuration === null || post.maxDuration === undefined) {
        throw new Error('maxDuration is required for lease post');
      } else if (
        post.maxInterestRate === null ||
        post.maxInterestRate === undefined
      ) {
        throw new Error('maxInterestRate is required for lease post');
      } else if (
        post.maxOverdueInterestRate === null ||
        post.maxOverdueInterestRate === undefined
      ) {
        throw new Error('maxOverdueInterestRate is required for lease post');
      }
    }

    return post;
  },
);
