/*
  Warnings:

  - You are about to drop the column `address` on the `Producer` table. All the data in the column will be lost.
  - You are about to drop the column `alias` on the `Producer` table. All the data in the column will be lost.
  - You are about to drop the column `feedstock` on the `Producer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Producer` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToVolume` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Producer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Producer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Producer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Producer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Producer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_producerId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVolume" DROP CONSTRAINT "_UserToVolume_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVolume" DROP CONSTRAINT "_UserToVolume_B_fkey";

-- DropIndex
DROP INDEX "Admin_username_key";

-- DropIndex
DROP INDEX "Producer_alias_key";

-- DropIndex
DROP INDEX "Producer_name_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Producer" DROP COLUMN "address",
DROP COLUMN "alias",
DROP COLUMN "feedstock",
DROP COLUMN "name",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "Sold" ADD COLUMN     "companyId" TEXT;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_UserToVolume";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "img" TEXT,
    "companyId" TEXT,
    "volumeId" INTEGER,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "address" TEXT,
    "feedstock" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToVolume" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_alias_key" ON "Company"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToVolume_AB_unique" ON "_CompanyToVolume"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToVolume_B_index" ON "_CompanyToVolume"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_email_key" ON "Producer"("email");

-- AddForeignKey
ALTER TABLE "Producer" ADD CONSTRAINT "Producer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToVolume" ADD CONSTRAINT "_CompanyToVolume_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToVolume" ADD CONSTRAINT "_CompanyToVolume_B_fkey" FOREIGN KEY ("B") REFERENCES "Volume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
