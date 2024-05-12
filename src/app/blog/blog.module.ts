import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [],
  providers: [BlogService],
  exports: [],
  controllers: [BlogController],
})
export class BlogModule {}
