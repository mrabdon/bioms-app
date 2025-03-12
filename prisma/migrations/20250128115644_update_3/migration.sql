-- DropForeignKey
ALTER TABLE "Sold" DROP CONSTRAINT "Sold_produceId_fkey";

-- AlterTable
ALTER TABLE "Sold" ALTER COLUMN "produceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE SET NULL ON UPDATE CASCADE;
