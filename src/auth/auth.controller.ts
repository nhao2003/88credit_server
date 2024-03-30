import {
  Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyPayLoad } from './dto/auth-body.dto';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
  ResponseMessage,
} from 'src/common/decorators';
import { RefreshTokenJwtGuard } from 'src/common/guards/refresh-token.guard';
import { AccessTokenJwtGuard } from 'src/common/guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('profile')
  @UseGuards(AccessTokenJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Profile fetched successfully')
  async profile(@GetCurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: AuthBodyPayLoad,
    @Ip() ip,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.signIn({
      ...body,
      ip: ip,
      userAgent: userAgent,
    });
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() body: AuthBodyPayLoad,
    @Ip() ip,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.signUp({
      ...body,
      ip: ip,
      userAgent: userAgent,
    });
  }

  @UseGuards(AccessTokenJwtGuard)
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@GetCurrentUser('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId);
  }

  @Post('forgot-password')
  async forgotPassword() {
    return this.authService.forgotPassword();
  }

  @Post('reset-password')
  async resetPassword() {
    return this.authService.resetPassword();
  }
  @Public()
  @UseGuards(RefreshTokenJwtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('sessionId') sessionId: string,
  ) {
    return this.authService.refreshToken(userId, sessionId);
  }
}
