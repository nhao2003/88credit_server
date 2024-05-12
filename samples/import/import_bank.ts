import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
const banks = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'banks.json'), 'utf8'),
);

banks.forEach((bank: any) => {
  delete bank.is_active;
  const createdAt = bank.created_at;
  delete bank.created_at;
  bank.createdAt = createdAt;
});

// fs.writeFileSync(
//   path.join(__dirname, '..', 'blogs.json'),
//   JSON.stringify(blogs, null, 2),
// );

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.bank.createMany({
    data: banks,
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
