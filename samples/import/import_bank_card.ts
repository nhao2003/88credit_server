import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
const cards = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'bank_cards.json'), 'utf8'),
);

cards.forEach((card: any) => {
  delete card.branch;
});

// fs.writeFileSync(
//   path.join(__dirname, '..', 'blogs.json'),
//   JSON.stringify(blogs, null, 2),
// );

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.bankCard.createMany({
    data: cards,
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
