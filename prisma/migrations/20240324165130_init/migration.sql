/*
  Warnings:

  - You are about to drop the column `monto` on the `Pago` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telefono]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descuento` to the `Pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoConDescuento` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "imgPath" TEXT,
ADD COLUMN     "telefono" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pago" DROP COLUMN "monto",
ADD COLUMN     "descuento" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "montoConDescuento" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefono_key" ON "Cliente"("telefono");
