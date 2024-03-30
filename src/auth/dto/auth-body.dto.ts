import { IsEmail, IsString } from 'class-validator';

export class AuthBodyPayLoad {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}
