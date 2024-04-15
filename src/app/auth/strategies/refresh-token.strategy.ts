import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.types';
import { JwtPayloadWithRefreshToken } from '../types/jwt-payload-with-rt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    if (!refreshToken)
      throw new ForbiddenException('Refresh token is required');

    const session = this.prismaService.session.findUnique({
      where: { id: payload.sessionId },
    });

    if (!session) {
      throw new ForbiddenException('Session not found');
    }
    console.log('payload', payload);
    return {
      ...payload,
      refreshToken,
    };
  }
}
