/*
  Warnings:

  - You are about to drop the column `careInstructions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `materials` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productionDate` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "careInstructions",
DROP COLUMN "materials",
DROP COLUMN "productionDate";
