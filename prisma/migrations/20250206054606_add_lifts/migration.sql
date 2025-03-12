/*
  Warnings:

  - You are about to drop the column `soldId` on the `Lift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lift" DROP CONSTRAINT "Lift_soldId_fkey";

-- AlterTable
ALTER TABLE "Lift" DROP COLUMN "soldId";
