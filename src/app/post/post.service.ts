import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto, CreatePostWithUserIdDto } from './dtos/post-pay-load.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { CheckValidPost } from './decorators/check_valid_post.decorator';
import Paging from 'src/common/types/paging.type';
import { Post } from '@prisma/client';

@Injectable()
@ApiTags('Post')
export class PostService {
  constructor(private prisamService: PrismaService) { }

  async createPost(@CheckValidPost() post: CreatePostWithUserIdDto) {
    return await this.prisamService.post.create({
      data: {
        ...post,
      },
    });
  }

  async getPosts(page: number | null, limit: number | null): Promise<Paging<Post>> {
    const take = limit || 20;
    page = page || 1;
    const skip = (page - 1) * take;
    const [items, total] = await Promise.all([
      this.prisamService.post.findMany({
        take,
        skip,
      }),
      this.prisamService.post.count(),
    ]);

    return {
      page,
      totalPages: Math.ceil(total / take),
      limit: take,
      items,
    };
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
