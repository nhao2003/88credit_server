import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
const blogs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'blogs.json'), 'utf8'),
);

blogs.forEach((blog: any) => {
  delete blog.is_active;
  const createdAt = blog.created_at;
  delete blog.created_at;
  blog.createdAt = createdAt;
});

// fs.writeFileSync(
//   path.join(__dirname, '..', 'blogs.json'),
//   JSON.stringify(blogs, null, 2),
// );

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.blog.createMany({
    data: blogs,
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
