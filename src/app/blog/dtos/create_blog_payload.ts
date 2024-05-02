import { IsString, IsNotEmpty } from 'class-validator';

class CreateBlogPayload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export default CreateBlogPayload;
