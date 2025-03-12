/*
  Warnings:

  - You are about to drop the column `userId` on the `Admin` table. All the data in the column will be lost.
  - Made the column `email` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Admin_userId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "userId",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;
