-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_produceId_fkey";

-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_producerId_fkey";

-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_volumeId_fkey";

-- AlterTable
ALTER TABLE "Sold" ALTER COLUMN "produceId" DROP NOT NULL,
ALTER COLUMN "volumeId" DROP NOT NULL,
ALTER COLUMN "producerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
