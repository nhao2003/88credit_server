import { $Enums, Prisma } from '@prisma/client';

class OTPWhere {
  code: string;
  userId: string;
  type: $Enums.OtpType;
  purpose: $Enums.OtpPurpose;
}

export default OTPWhere;
