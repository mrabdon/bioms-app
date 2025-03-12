/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Producer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Producer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producer" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Producer_clerkId_key" ON "Producer"("clerkId");
