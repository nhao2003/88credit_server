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
  pending: LoanRequestStatus.pending,
  approved: LoanRequestStatus.approved,
  rejected: LoanRequestStatus.rejected,
  cancelled: LoanRequestStatus.cancelled,
  paid: LoanRequestStatus.paid,
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
  return $Enums.LoanReasonTypes.other;
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
