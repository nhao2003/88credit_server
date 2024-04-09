import { Injectable } from '@nestjs/common';
import OTPPayload from './dtos/otp-payload.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import OTPWhere from './dtos/otp-where.dto';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class OtpService {
  private otpSercet: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.otpSercet = this.configService.get<string>('OTP_SECRET');
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async hashOtp(otp: string): Promise<string> {
    return await bcrypt.hash(otp + this.otpSercet, 10);
  }

  async createOtp(OtpGetPayload: OTPPayload): Promise<string> {
    const otp = this.generateOtp();
    const hashedOtp = await this.hashOtp(otp);
    await this.prismaService.otp.create({
      data: {
        userId: OtpGetPayload.userId,
        token: hashedOtp,
        type: OtpGetPayload.type,
        purpose: OtpGetPayload.purpose,
        expiresAt: OtpGetPayload.expiresAt,
      },
    });
    return otp;
  }

  async verifyOtp(otp: OTPWhere): Promise<boolean> {
    const otpRecord = await this.prismaService.otp.findFirst({
      where: {
        userId: otp.userId,
        token: this.hashOtp(otp.code).toString(),
        type: otp.type,
        purpose: otp.purpose,
      },
    });
    if (!otpRecord) {
      return false;
    }
    if (otpRecord.expiresAt < new Date() || otpRecord.verifiedAt) {
      return false;
    }
    await this.prismaService.otp.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verifiedAt: new Date(),
      },
    });
    return true;
  }
}
