import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.types';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    config: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const session = await this.prismaService.session.findUnique({
      where: { id: payload.sessionId },
    });

    if (!session) {
      console.log('Session not found');
      throw new ForbiddenException('Session not found');
    }
    return payload;
  }
}
