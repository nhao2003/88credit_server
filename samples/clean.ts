import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
const banks = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'banks.json'), 'utf8'),
);

banks.forEach((bank: any) => {
  delete bank.transferSupported;
  delete bank.lookupSupported;
  delete bank.short_name;
  delete bank.support;
  delete bank.isTransfer;
  delete bank.swift_code;
});

const prisma = new PrismaClient();

async function main() {
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
