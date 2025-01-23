-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'producer', 'staff');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT,
    "username" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "img" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volume" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quarter" TEXT,
    "year" INTEGER,
    "proposedVolume" INTEGER,
    "committedVolume" INTEGER,
    "begInventory" INTEGER,
    "totalStock" INTEGER,
    "sold" INTEGER,
    "unsold" INTEGER,
    "producerId" TEXT,
    "consumerId" TEXT,

    CONSTRAINT "Volume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActualProduce" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualProduction" INTEGER,
    "month" TEXT,
    "volumeId" INTEGER,

    CONSTRAINT "ActualProduce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeSoldToProducer" (
    "id" SERIAL NOT NULL,
    "soldAmount" INTEGER NOT NULL,
    "mc" INTEGER,
    "mro" INTEGER,

    CONSTRAINT "VolumeSoldToProducer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "address" TEXT,
    "feedstock" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "producerId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "producerId" TEXT,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToVolume" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_VolumeToVolumeSoldToProducer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProducerToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProducerToVolumeSoldToProducer" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ConsumerToVolumeSoldToProducer" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_name_key" ON "Producer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_alias_key" ON "Producer"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_name_key" ON "Consumer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVolume_AB_unique" ON "_UserToVolume"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVolume_B_index" ON "_UserToVolume"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VolumeToVolumeSoldToProducer_AB_unique" ON "_VolumeToVolumeSoldToProducer"("A", "B");

-- CreateIndex
CREATE INDEX "_VolumeToVolumeSoldToProducer_B_index" ON "_VolumeToVolumeSoldToProducer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProducerToUser_AB_unique" ON "_ProducerToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProducerToUser_B_index" ON "_ProducerToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProducerToVolumeSoldToProducer_AB_unique" ON "_ProducerToVolumeSoldToProducer"("A", "B");

-- CreateIndex
CREATE INDEX "_ProducerToVolumeSoldToProducer_B_index" ON "_ProducerToVolumeSoldToProducer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConsumerToVolumeSoldToProducer_AB_unique" ON "_ConsumerToVolumeSoldToProducer"("A", "B");

-- CreateIndex
CREATE INDEX "_ConsumerToVolumeSoldToProducer_B_index" ON "_ConsumerToVolumeSoldToProducer"("B");

-- AddForeignKey
ALTER TABLE "Volume" ADD CONSTRAINT "Volume_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volume" ADD CONSTRAINT "Volume_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActualProduce" ADD CONSTRAINT "ActualProduce_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVolume" ADD CONSTRAINT "_UserToVolume_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVolume" ADD CONSTRAINT "_UserToVolume_B_fkey" FOREIGN KEY ("B") REFERENCES "Volume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VolumeToVolumeSoldToProducer" ADD CONSTRAINT "_VolumeToVolumeSoldToProducer_A_fkey" FOREIGN KEY ("A") REFERENCES "Volume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VolumeToVolumeSoldToProducer" ADD CONSTRAINT "_VolumeToVolumeSoldToProducer_B_fkey" FOREIGN KEY ("B") REFERENCES "VolumeSoldToProducer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProducerToUser" ADD CONSTRAINT "_ProducerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProducerToUser" ADD CONSTRAINT "_ProducerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProducerToVolumeSoldToProducer" ADD CONSTRAINT "_ProducerToVolumeSoldToProducer_A_fkey" FOREIGN KEY ("A") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProducerToVolumeSoldToProducer" ADD CONSTRAINT "_ProducerToVolumeSoldToProducer_B_fkey" FOREIGN KEY ("B") REFERENCES "VolumeSoldToProducer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsumerToVolumeSoldToProducer" ADD CONSTRAINT "_ConsumerToVolumeSoldToProducer_A_fkey" FOREIGN KEY ("A") REFERENCES "Consumer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsumerToVolumeSoldToProducer" ADD CONSTRAINT "_ConsumerToVolumeSoldToProducer_B_fkey" FOREIGN KEY ("B") REFERENCES "VolumeSoldToProducer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
