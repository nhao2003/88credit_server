import { OtpPurpose, OtpType } from '@prisma/client';

class OTPPayload {
  userId: string;
  expiresAt: Date;
  type: OtpType;
  purpose: OtpPurpose;
}

export default OTPPayload;
