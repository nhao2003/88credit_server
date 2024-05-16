import { Injectable } from '@nestjs/common';
import BlogPayload from './dtos/blog_payload';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { Blog } from '@prisma/client';
import { BlogQuery } from './query/blog_query';
import Paging from 'src/common/types/paging.type';

@Injectable()
export class BlogService {
  constructor(private readonly prismService: PrismaService) {}
  createBlog(createBlogPayload: BlogPayload): Promise<Blog> {
    return this.prismService.blog.create({
      data: {
        ...createBlogPayload,
      },
    });
  }

  async getBlogs(blogQuery: BlogQuery): Promise<Paging<Blog>> {
    const query = {
      skip: blogQuery.skip,
      take: blogQuery.take,
      orderBy: blogQuery.orderBy || {
        createdAt: 'desc',
      },
      where: blogQuery.where,
    };

    const result = await Promise.all([
      this.prismService.blog.count({ where: query.where }),
      this.prismService.blog.findMany(query),
    ]);

    return {
      page: query.skip / query.take + 1,
      take: blogQuery.take,
      totalPages: Math.ceil(result[0] / blogQuery.take),
      items: result[1],
    };
  }

  async getBlogById(id: string): Promise<Blog> {
    return this.prismService.blog.findUnique({
      where: {
        id,
      },
    });
  }

  async updateBlog(id: string, createBlogPayload: BlogPayload): Promise<Blog> {
    return this.prismService.blog.update({
      where: {
        id,
      },
      data: {
        ...createBlogPayload,
      },
    });
  }

  async deleteBlog(id: string): Promise<Blog> {
    return this.prismService.blog.delete({
      where: {
        id,
      },
    });
  }
}
