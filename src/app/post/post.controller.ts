import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { RpcBody, RpcQuery, RpcUserId } from 'src/common/decorators';
import { CreatePostDto } from './dtos/post-pay-load.dto';
import { MessagePattern } from '@nestjs/microservices';
import { query } from 'express';
import { PostQueryBuilderDirector, PostQueryPayload } from './query/post_query';

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @MessagePattern('post.create')
  async createPost(
    @RpcUserId() userId: string,
    @RpcBody() post: CreatePostDto,
  ) {
    return await this.postService.createPost({
      ...post,
      userId: userId,
    });
  }

  @MessagePattern('post.get')
  async getPosts(@RpcQuery() payload: PostQueryPayload) {
    const query = new PostQueryBuilderDirector(payload).build();
    return await this.postService.getPosts(query);
  }
}
