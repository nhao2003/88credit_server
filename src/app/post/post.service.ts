import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/post-pay-load.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
@ApiTags('Post')
export class PostService {
  constructor(private prisamService: PrismaService) {}

  async createPost(userId: string, post: CreatePostDto) {
    return this.prisamService.post.create({
      data: {
        ...post,
        userId,
      },
    });
  }
}
