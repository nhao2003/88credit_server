import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { RpcBody, RpcQuery, RpcUserId } from 'src/common/decorators';
import { CreatePostDto } from './dtos/post-pay-load.dto';
import { MessagePattern } from '@nestjs/microservices';

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
  async getPosts(
    @RpcQuery('page') page: number | null,
    @RpcQuery('limit') limit: number | null,
  ) {
    return await this.postService.getPosts(page, limit);
  }
}
