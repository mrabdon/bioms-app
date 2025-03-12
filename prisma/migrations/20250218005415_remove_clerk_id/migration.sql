/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Producer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Producer_clerkId_key";

-- AlterTable
ALTER TABLE "Producer" DROP COLUMN "clerkId";
