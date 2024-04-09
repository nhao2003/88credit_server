import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsValidPassword } from 'src/common/decorators/validation';

export class AuthPayLoad {
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'Email of the user',
    example: 'abc@abc.com',
  })
  email: string;

  @IsValidPassword()
  @ApiProperty({
    description:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Password123!',
  })
  password: string;
}
