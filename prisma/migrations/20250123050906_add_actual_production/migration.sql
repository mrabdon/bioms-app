-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_producerId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "producerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
