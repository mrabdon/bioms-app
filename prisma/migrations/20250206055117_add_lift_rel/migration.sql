/*
  Warnings:

  - You are about to drop the column `consumerId` on the `Lift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lift" DROP CONSTRAINT "Lift_consumerId_fkey";

-- AlterTable
ALTER TABLE "Lift" DROP COLUMN "consumerId",
ADD COLUMN     "soldId" INTEGER;

-- AddForeignKey
ALTER TABLE "Lift" ADD CONSTRAINT "Lift_soldId_fkey" FOREIGN KEY ("soldId") REFERENCES "Sold"("id") ON DELETE SET NULL ON UPDATE CASCADE;
