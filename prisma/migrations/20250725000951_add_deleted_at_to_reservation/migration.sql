/*
  Warnings:

  - A unique constraint covering the columns `[id,tenantId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_id_tenantId_key" ON "Reservation"("id", "tenantId");
