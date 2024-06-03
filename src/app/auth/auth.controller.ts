import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
  ResponseMessage,
  RpcBody,
  RpcUser,
  RpcUserId,
} from 'src/common/decorators';
import { RefreshTokenJwtGuard } from 'src/common/guards/refresh-token.guard';
import { AccessTokenJwtGuard } from 'src/common/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthPayLoad } from './dto';
import { Tokens } from './types';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Authentications')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('profile')
  async profile(@RpcUser() user: any) {
    return user;
  }

  @MessagePattern('sign-in')
  async signIn(@RpcBody() body: any): Promise<Tokens> {
    console.log('body', body);
    return this.authService.signIn(body);
  }

  @MessagePattern('sign-up')
  async signUp(@RpcBody() body: AuthPayLoad): Promise<Tokens> {
    return this.authService.signUp(body);
  }

  @MessagePattern('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@RpcUser('sessionId') sessionId: string): Promise<void> {
    return this.authService.signOut(sessionId);
  }

  @Public()
  @MessagePattern('forgot-password')
  async forgotPassword(): Promise<string> {
    return this.authService.forgotPassword();
  }

  @MessagePattern('reset-password')
  async resetPassword(): Promise<string> {
    return this.authService.resetPassword();
  }

  @MessagePattern('refresh-token')
  async refreshToken(
    @RpcUserId() userId: string,
    @RpcUser('sessionId') sessionId: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, sessionId);
  }
}
