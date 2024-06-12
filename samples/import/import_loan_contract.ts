import * as fs from 'fs';
import * as path from 'path';
import {
  $Enums,
  LoanContract,
  LoanRequest,
  LoanRequestStatus,
  PrismaClient,
} from '@prisma/client';
const prisma = new PrismaClient();
let requests = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'requests.json'), 'utf8'),
);
const contracts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'contracts.json'), 'utf8'),
);

requests = requests.filter((request) => request.status === 'paid');

const newContracts: any[] = [];

requests.forEach((request: LoanRequest) => {
  newContracts.push({
    loanReasonType: request.loanReasonType,
    amount: request.loanAmount,
    borrowerId: request.senderId,
    lenderId: request.receiverId,
    borrowerBankCardId: request.senderBankCardId,
    lenderBankCardId: request.receiverBankCardId,
    loanReason: request.loanReason,
    interestRate: request.interestRate,
    loanRequestId: request.id,
    overdueInterestRate: request.overdueInterestRate,
    tenureInMonths: request.loanTenureMonths,
    // Random CreatedAt
    createdAt: new Date(
      new Date().getTime() - Math.floor(Math.random() * 10000000000),
    ),
  });
});

async function main() {
  await prisma.loanContract.deleteMany();
  await prisma.loanContract.createMany({
    data: newContracts,
  });
  const loanContracts = await prisma.loanContract.findMany();
  fs.writeFileSync(
    path.join(__dirname, '..', 'contracts.json'),
    JSON.stringify(loanContracts, null, 2),
  );
  prisma.$disconnect();
}

main().catch((e) => {
  throw e;
});

// fs.writeFileSync(
//   path.join(__dirname, '..', 'contracts.json'),
//   JSON.stringify(contracts, null, 2),
// );

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

// const loanRequestStringToStatus = {
//   pending: LoanRequestStatus.pending,
//   approved: LoanRequestStatus.approved,
//   rejected: LoanRequestStatus.rejected,
//   cancelled: LoanRequestStatus.cancelled,
//   paid: LoanRequestStatus.paid,
// };

// const loanReasonStringToEnum = (reason: string) => {
//   for (
//     let index = 0;
//     index < Object.values($Enums.LoanReasonTypes).length;
//     index++
//   ) {
//     const enumValue = Object.values($Enums.LoanReasonTypes)[index];
//     if (enumValue.toString().toLowerCase() === reason.toLowerCase()) {
//       return enumValue;
//     }
//   }
//   return $Enums.LoanReasonTypes.other;
// };

// async function main() {
//   await prisma.$connect();
//   await prisma.loanContract.deleteMany();
//   await prisma.loanContract.createMany({
//     data: contracts.map((request) => ({
//       ...request,
//       loanReasonType: loanReasonStringToEnum(request.loanReasonType),
//     })),
//   });
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
