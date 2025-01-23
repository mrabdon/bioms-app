/*
  Warnings:

  - You are about to drop the `_ProducerToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `producerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProducerToUser" DROP CONSTRAINT "_ProducerToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProducerToUser" DROP CONSTRAINT "_ProducerToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "producerId" TEXT NOT NULL,
ALTER COLUMN "img" DROP NOT NULL;

-- DropTable
DROP TABLE "_ProducerToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
