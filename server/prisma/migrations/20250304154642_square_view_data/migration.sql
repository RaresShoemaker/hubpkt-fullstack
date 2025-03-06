/*
  Warnings:

  - You are about to drop the column `isCreator` on the `cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "isCreator",
ADD COLUMN     "isSquare" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "hasSquareContent" BOOLEAN NOT NULL DEFAULT false;
