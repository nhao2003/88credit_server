import * as fs from 'fs';
import * as path from 'path';
import { $Enums, LoanRequestStatus, PrismaClient } from '@prisma/client';
const requests = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'requests.json'), 'utf8'),
);
// fs.writeFileSync(
//   path.join(__dirname, '..', 'requests.json'),
//   JSON.stringify(requests, null, 2),
// );
// enum LoanRequestStatus {
//     PENDING   @map("pending")
//     APPROVED  @map("approved")
//     REJECTED  @map("rejected")
//     CANCELLED @map("cancelled")
//     WAITINGFORPAYMENT @map("waitingForPayment")
//     PAID @map("paid")
//   }

const loanRequestStringToStatus = {
  pending: LoanRequestStatus.PENDING,
  approved: LoanRequestStatus.APPROVED,
  rejected: LoanRequestStatus.REJECTED,
  cancelled: LoanRequestStatus.CANCELLED,
  waitingForPayment: LoanRequestStatus.WAITING_FOR_PAYMENT,
  paid: LoanRequestStatus.PAID,
};

const loanReasonStringToEnum = (reason: string) => {
  for (
    let index = 0;
    index < Object.values($Enums.LoanReasonTypes).length;
    index++
  ) {
    const enumValue = Object.values($Enums.LoanReasonTypes)[index];
    if (enumValue.toString().toLowerCase() === reason.toLowerCase()) {
      return enumValue;
    }
  }
  return $Enums.LoanReasonTypes.OTHER;
};
const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.loanRequest.deleteMany();
  await prisma.loanRequest.createMany({
    data: requests.map((request) => ({
      ...request,
      status: loanRequestStringToStatus[request.status],
      loanReasonType: loanReasonStringToEnum(request.loanReasonType),
    })),
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
