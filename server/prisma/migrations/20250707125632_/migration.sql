/*
  Warnings:

  - Added the required column `fileName` to the `image_metadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `image_metadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `image_metadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image_metadata" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
