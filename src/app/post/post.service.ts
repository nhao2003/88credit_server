import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto, CreatePostWithUserIdDto } from './dtos/post-pay-load.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { CheckValidPost } from './decorators/check_valid_post.decorator';

@Injectable()
@ApiTags('Post')
export class PostService {
  constructor(private prisamService: PrismaService) {}

  async createPost( @CheckValidPost() post: CreatePostWithUserIdDto) {
    return await this.prisamService.post.create({
      data: {
        ...post,
      },
    });
  }

  async getPosts() {
    return await this.prisamService.post.findMany();
  }

  async getPostById(id: string) {
    return await this.prisamService.post.findUnique({
      where: {
        id,
      },
    });
  }

  async updatePost(id: string, post: CreatePostDto) {
    return await this.prisamService.post.update({
      where: {
        id,
      },
      data: {
        ...post,
      },
    });
  }
}
