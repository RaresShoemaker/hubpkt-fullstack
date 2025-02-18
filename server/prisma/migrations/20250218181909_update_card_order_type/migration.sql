/*
  Warnings:

  - The `order` column on the `cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "order",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
