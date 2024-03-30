import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthBodyPayLoad } from './dto/auth-body.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayLoad } from './dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async generateAccessToken(userId: string, sessionId: string) {
    return this.jwtService.signAsync(
      { userId, sessionId },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
  }

  async generateRefreshToken(userId: string, sessionId: string) {
    return this.jwtService.signAsync(
      { userId, sessionId },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );
  }

  async createSession(
    userId: string,
    authPayload: AuthPayLoad,
  ): Promise<Tokens> {
    const session = await this.prismaService.session.create({
      data: {
        userId: userId,
        userAgent: authPayload.userAgent,
        ip: authPayload.ip,
      },
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, session.id),
      this.generateRefreshToken(userId, session.id),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(authPayload: AuthPayLoad): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authPayload.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      authPayload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }

    return this.createSession(user.id, authPayload);
  }

  async signUp(authPayload: AuthPayLoad): Promise<Tokens> {
    const hashedPassword = await this.hashData(authPayload.password);
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authPayload.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.prismaService.user.create({
      data: {
        email: authPayload.email,
        password: hashedPassword,
      },
    });

    return this.createSession(newUser.id, authPayload);
  }

  async signOut(sessionId: string) {
    await this.prismaService.session.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async forgotPassword() {
    return 'forgot-password';
  }

  async resetPassword() {
    return 'reset-password';
  }

  async refreshToken(userId: string, sessionId: string): Promise<Tokens> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await Promise.all([
      await this.prismaService.session.update({
        where: {
          id: sessionId,
          userId: userId,
        },
        data: {
          refreshAt: new Date(),
        },
      }),
      this.generateAccessToken(user.id, sessionId),
      this.generateRefreshToken(user.id, sessionId),
    ]);
    return {
      accessToken: tokens[1],
      refreshToken: tokens[2],
    };
  }
}
