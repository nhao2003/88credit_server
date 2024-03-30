import { IsEmail, IsString } from 'class-validator';

export class AuthPayLoad {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  userAgent: string;

  @IsString()
  ip: string;
}
