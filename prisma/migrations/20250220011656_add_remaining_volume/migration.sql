/*
  Warnings:

  - You are about to drop the column `remainingVolume` on the `Lift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lift" DROP COLUMN "remainingVolume",
ADD COLUMN     "remainingLiftVolume" INTEGER;

-- AlterTable
ALTER TABLE "Produce" ADD COLUMN     "remainingProduceVolume" INTEGER;
