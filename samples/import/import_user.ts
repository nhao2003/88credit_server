import * as fs from 'fs';
import * as path from 'path';
import { AccountStatus, PrismaClient, Role } from '@prisma/client';
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'users.json'), 'utf8'),
);

users.forEach((user: any) => {
  user.password =
    '$2b$10$ncEX/2jmLUFm9GQzapSJle4vz5MMuhG0aV8hIWEZP/vaw3EJIIFZe';
  user.dob = new Date(user.dob);
});

fs.writeFileSync(
  path.join(__dirname, '..', 'users.json'),
  JSON.stringify(users, null, 2),
);

const prisma = new PrismaClient();

const mapStatus = {
  unverified: AccountStatus.UNVERIFIED,
  verified: AccountStatus.VERIFIED,
  notUpdated: AccountStatus.NOT_UPDATED,
  banned: AccountStatus.BANNED,
  deleted: AccountStatus.DELETED,
};

const mapRole = {
  user: Role.USER,
  admin: Role.ADMIN,
};

async function main() {
  await prisma.$connect();
  await prisma.user.createMany({
    data: users.map((user) => {
      delete user.address;
      return {
        ...user,
        status: mapStatus[user.status],
        role: mapRole[user.role],
      };
    }),
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
