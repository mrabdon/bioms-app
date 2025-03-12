-- CreateTable
CREATE TABLE "Lift" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liftVolume" INTEGER NOT NULL,
    "remainingVolume" INTEGER,
    "region" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "consumerId" TEXT,
    "soldId" INTEGER,

    CONSTRAINT "Lift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lift" ADD CONSTRAINT "Lift_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lift" ADD CONSTRAINT "Lift_soldId_fkey" FOREIGN KEY ("soldId") REFERENCES "Sold"("id") ON DELETE SET NULL ON UPDATE CASCADE;
