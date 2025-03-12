/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `Admin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Admin_clerkUserId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "clerkUserId";
