/*
  Warnings:

  - You are about to drop the column `agotado` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "agotado",
ADD COLUMN     "soldOut" BOOLEAN NOT NULL DEFAULT false;
