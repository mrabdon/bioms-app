/*
  Warnings:

  - You are about to drop the `ActualProduce` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VolumeSoldToProducer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConsumerToVolumeSoldToProducer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProducerToVolumeSoldToProducer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VolumeToVolumeSoldToProducer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActualProduce" DROP CONSTRAINT "ActualProduce_volumeId_fkey";

-- DropForeignKey
ALTER TABLE "VolumeSoldToProducer" DROP CONSTRAINT "VolumeSoldToProducer_actualProduceId_fkey";

-- DropForeignKey
ALTER TABLE "_ConsumerToVolumeSoldToProducer" DROP CONSTRAINT "_ConsumerToVolumeSoldToProducer_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConsumerToVolumeSoldToProducer" DROP CONSTRAINT "_ConsumerToVolumeSoldToProducer_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProducerToVolumeSoldToProducer" DROP CONSTRAINT "_ProducerToVolumeSoldToProducer_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProducerToVolumeSoldToProducer" DROP CONSTRAINT "_ProducerToVolumeSoldToProducer_B_fkey";

-- DropForeignKey
ALTER TABLE "_VolumeToVolumeSoldToProducer" DROP CONSTRAINT "_VolumeToVolumeSoldToProducer_A_fkey";

-- DropForeignKey
ALTER TABLE "_VolumeToVolumeSoldToProducer" DROP CONSTRAINT "_VolumeToVolumeSoldToProducer_B_fkey";

-- DropTable
DROP TABLE "ActualProduce";

-- DropTable
DROP TABLE "VolumeSoldToProducer";

-- DropTable
DROP TABLE "_ConsumerToVolumeSoldToProducer";

-- DropTable
DROP TABLE "_ProducerToVolumeSoldToProducer";

-- DropTable
DROP TABLE "_VolumeToVolumeSoldToProducer";

-- CreateTable
CREATE TABLE "Produce" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualProduction" INTEGER,
    "month" TEXT,
    "volumeId" INTEGER,

    CONSTRAINT "Produce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sold" (
    "id" SERIAL NOT NULL,
    "soldAmount" INTEGER NOT NULL,
    "mc" INTEGER,
    "mro" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "produceId" INTEGER NOT NULL,
    "consumerId" TEXT NOT NULL,
    "volumeId" INTEGER,
    "producerId" TEXT,

    CONSTRAINT "Sold_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Produce" ADD CONSTRAINT "Produce_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
