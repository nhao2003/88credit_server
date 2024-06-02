import * as fs from 'fs';
import * as path from 'path';
import { $Enums, LoanRequestStatus, PrismaClient } from '@prisma/client';
const posts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'posts.json'), 'utf8'),
);

const postStringToStatus = Object.keys(LoanRequestStatus).reduce((acc, key) => {
  acc[key] = LoanRequestStatus[key];
  return acc;
}, {});

const postTypeStringToEnum = (type: string) => {
  for (let index = 0; index < Object.values($Enums.PostTypes).length; index++) {
    const enumValue = Object.values($Enums.PostTypes)[index];
    if (enumValue.toString().toLowerCase() === type.toLowerCase()) {
      return enumValue;
    }
  }
  throw new Error(`Unknown post type: ${type}`);
};

// Change loanReason to Random $Enums.LoanReasonTypes

// for (let i = 0; i < posts.length; i++) {
//   posts[i].loanReason = Object.values($Enums.LoanReasonTypes)[
//     Math.floor(Math.random() * Object.values($Enums.LoanReasonTypes).length)
//   ];
// }

// fs.writeFileSync(
//     path.join(__dirname, '..', 'posts.json'),
//     JSON.stringify(posts, null, 2),
//     );

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.post.deleteMany();
  await prisma.post.createMany({
    data: posts.map((request) => ({
      ...request,
      status: postStringToStatus[request.status],
      type: postTypeStringToEnum(request.type),
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
