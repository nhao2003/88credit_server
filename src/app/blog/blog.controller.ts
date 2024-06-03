import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Response,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import BlogPayload from './dtos/blog_payload';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogQueryDirector, BlogQueryPayload } from './query/blog_query';
import { MessagePattern } from '@nestjs/microservices';
import { NotFoundError } from 'rxjs';
import { RpcBody, RpcParam, RpcQuery } from 'src/common/decorators';

@Controller()
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @MessagePattern('blog.create')
  async createBlog(@RpcBody() createBlogPayload: BlogPayload) {
    return this.blogService.createBlog(createBlogPayload);
  }
  @MessagePattern('blog.get')
  async getBlogs(@RpcQuery() query: BlogQueryPayload) {
    const director = new BlogQueryDirector(query);
    const queryBuilder = director.build();
    return this.blogService.getBlogs(queryBuilder);
  }
  @MessagePattern('blog.get-by-id')
  async getBlogById(@RpcParam('id') id: string) {
    return this.blogService.getBlogById(id);
  }
  @MessagePattern('blog.update')
  async updateBlog(
    @RpcParam('id') id: string,
    @RpcBody() createBlogPayload: BlogPayload,
  ) {
    return this.blogService.updateBlog(id, createBlogPayload);
  }
  @MessagePattern('blog.delete')
  async deleteBlog(@RpcParam('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
