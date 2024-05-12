import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class BlogPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the blog',
    example: 'My first blog',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Short description of the blog',
    example: 'This is my first blog',
  })
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Author of the blog',
    example: 'John Doe',
  })
  author: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Content of the blog',
    example: '<p>This is my first blog</p>',
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Thumbnail of the blog',
    example: 'https://picsum.photos/200/300',
  })
  thumbnail: string;
}

export default BlogPayload;
