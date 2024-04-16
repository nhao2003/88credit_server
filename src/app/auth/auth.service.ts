import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayLoad } from './dto';
import { OtpPurpose, OtpType } from '@prisma/client';
import { OtpService } from '../otp/otp.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { MailService } from '../notification/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private mailService: MailService,
    private otpService: OtpService,
    private prismaService: PrismaService,
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async generateAccessToken(userId: string, sessionId: string) {
    return this.jwtService.signAsync(
      { userId, sessionId },
      {
        expiresIn: '1d',
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

  async createSession(userId: string): Promise<Tokens> {
    const session = await this.prismaService.session.create({
      data: {
        userId: userId,
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
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(
      authPayload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Email or password is incorrect');
    }

    return this.createSession(user.id);
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
        firstName: '',
        lastName: '',
        gender: false,
        dob: new Date(),
        phone: '',
        email: authPayload.email,
        password: hashedPassword,
      },
    });
    const otp = await this.otpService.createOtp({
      userId: newUser.id,
      expiresAt: new Date(),
      type: OtpType.EMAIL,
      purpose: OtpPurpose.EMAIL_VERIFICATION,
    });
    this.mailService.sendMail({
      to: newUser.email,
      subject: 'Email Verification',
      body: `Your OTP is ${otp}`,
    });
    return this.createSession(newUser.id);
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
      throw new ForbiddenException('Access Denied for this user');
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
