/*
  Warnings:

  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `guests` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `tableId` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `guestNumber` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurant` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `date` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_pkey",
DROP COLUMN "guests",
DROP COLUMN "restaurantId",
DROP COLUMN "tableId",
ADD COLUMN     "guestNumber" INTEGER NOT NULL,
ADD COLUMN     "restaurant" TEXT NOT NULL,
ADD COLUMN     "tableName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reservation_id_seq";
