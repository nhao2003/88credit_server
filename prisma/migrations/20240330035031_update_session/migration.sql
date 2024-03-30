/*
  Warnings:

  - You are about to drop the column `token` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `ip` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshAt` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "token",
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "refreshAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL;
