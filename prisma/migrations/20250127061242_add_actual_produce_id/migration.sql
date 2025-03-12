/*
  Warnings:

  - Added the required column `actualProduceId` to the `VolumeSoldToProducer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VolumeSoldToProducer" ADD COLUMN     "actualProduceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "VolumeSoldToProducer" ADD CONSTRAINT "VolumeSoldToProducer_actualProduceId_fkey" FOREIGN KEY ("actualProduceId") REFERENCES "ActualProduce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
