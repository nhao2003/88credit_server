import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { CreatePostDto } from './dtos/post-pay-load.dto';
import { JwtPayloadWithRefreshToken } from '../auth/types/jwt-payload-with-rt';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiBearerAuth()
  async createPost(
    @GetCurrentUser() userId: JwtPayloadWithRefreshToken,
    @Body() post: CreatePostDto,
  ) {
    return await this.postService.createPost(userId.userId, post);
  }
}
