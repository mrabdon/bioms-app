/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Admin_clerkId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "clerkId",
ADD COLUMN     "clerkUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkUserId_key" ON "Admin"("clerkUserId");
