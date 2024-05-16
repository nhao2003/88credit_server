import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
  ResponseMessage,
} from 'src/common/decorators';
import { CreatePostDto } from './dtos/post-pay-load.dto';
import { JwtPayloadWithRefreshToken } from '../auth/types/jwt-payload-with-rt';
import { CheckValidPost } from './decorators/check_valid_post.decorator';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ResponseMessage('Post created successfully')
  async createPost(
    @GetCurrentUser() userId: JwtPayloadWithRefreshToken,
    @Body() post: CreatePostDto,
  ) {
    return await this.postService.createPost({
      ...post,
      userId: userId.userId,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Posts fetched successfully')
  async getPosts(
    @Query('page') page: number | null,
    @Query('limit') limit: number | null,
  ) {
    return await this.postService.getPosts(page, limit);
  }
}
