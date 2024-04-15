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
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
  ResponseMessage,
} from 'src/common/decorators';
import { RefreshTokenJwtGuard } from 'src/common/guards/refresh-token.guard';
import { AccessTokenJwtGuard } from 'src/common/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthPayLoad } from './dto';

@Controller('auth')
@ApiTags('Authentications')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('profile')
  @UseGuards(AccessTokenJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile fetched successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ResponseMessage('Profile fetched successfully')
  async profile(@GetCurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: AuthPayLoad) {
    return this.authService.signIn(body);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: AuthPayLoad) {
    return this.authService.signUp(body);
  }

  @UseGuards(AccessTokenJwtGuard)
  @Post('sign-out')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async signOut(@GetCurrentUser('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword() {
    return this.authService.forgotPassword();
  }

  @Post('reset-password')
  // Use RefreshTokenJwtGuard to protect the route
  @ApiBearerAuth()
  async resetPassword() {
    return this.authService.resetPassword();
  }

  @Public()
  @UseGuards(RefreshTokenJwtGuard)
  @Post('refresh-token')
  @ApiSecurity('refresh_token')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <refresh_token>',
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('sessionId') sessionId: string,
  ) {
    return this.authService.refreshToken(userId, sessionId);
  }
}
