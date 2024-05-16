import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

@ApiTags('Blog')
@Controller('blog')
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Blog created successfully',
  })
  async createBlog(@Body() createBlogPayload: BlogPayload) {
    return this.blogService.createBlog(createBlogPayload);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Blogs fetched successfully',
  })
  async getBlogs(@Query() query: BlogQueryPayload) {
    const director = new BlogQueryDirector(query);
    const queryBuilder = director.build();
    return this.blogService.getBlogs(queryBuilder);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Blog updated successfully',
  })
  async updateBlog(
    @Param('id') id: string,
    @Body() createBlogPayload: BlogPayload,
  ) {
    return this.blogService.updateBlog(id, createBlogPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
