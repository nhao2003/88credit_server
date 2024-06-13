import { Body, Injectable } from '@nestjs/common';
import {
  CreatePostDto,
  CreatePostWithUserIdDto,
} from './dtos/post-pay-load.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { CheckValidPost } from './decorators/check_valid_post.decorator';
import Paging from 'src/common/types/paging.type';
import { $Enums, Post } from '@prisma/client';
import { PostQuery } from './query/post_query';

@Injectable()
@ApiTags('Post')
export class PostService {
  constructor(private prisamService: PrismaService) {}

  async createPost(@CheckValidPost() post: CreatePostWithUserIdDto) {
    return await this.prisamService.post.create({
      data: {
        ...post,
      },
    });
  }

  async getPosts(query: PostQuery): Promise<Paging<Post>> {
    const filter = {
      where: query.where,
      orderBy: query.orderBy,
      skip: query.skip,
      take: query.take,
    };
    const [posts, total] = await Promise.all([
      this.prisamService.post.findMany({
        ...filter,
        include: {
          user: true,
        },
      }),
      this.prisamService.post.count({
        where: query.where,
      }),
    ]);
    return {
      page: query.skip / query.take + 1,
      take: query.take,
      totalPages: Math.ceil(total / query.take),
      items: posts,
    };
  }

  async getPostById(id: string) {
    return await this.prisamService.post.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
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

  async approvePost(id: string) {
    return await this.prisamService.post.update({
      where: {
        id,
      },
      data: {
        status: $Enums.PostStatus.approved,
      },
    });
  }

  async rejectPost(id: string, rejectionReason: string) {
    return await this.prisamService.post.update({
      where: {
        id,
      },
      data: {
        status: $Enums.PostStatus.rejected,
        rejectionReason,
      },
    });
  }

  async deletePost(id: string) {
    return await this.prisamService.post.delete({
      where: {
        id,
      },
    });
  }
}
