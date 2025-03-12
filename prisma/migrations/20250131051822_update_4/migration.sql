/*
  Warnings:

  - Made the column `produceId` on table `Sold` required. This step will fail if there are existing NULL values in that column.
  - Made the column `volumeId` on table `Sold` required. This step will fail if there are existing NULL values in that column.
  - Made the column `producerId` on table `Sold` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_produceId_fkey";

-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_producerId_fkey";

-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_volumeId_fkey";

-- AlterTable
ALTER TABLE "Sold" ALTER COLUMN "produceId" SET NOT NULL,
ALTER COLUMN "volumeId" SET NOT NULL,
ALTER COLUMN "producerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
