/*
  Warnings:

  - You are about to drop the column `categoryDesignId` on the `design_elements` table. All the data in the column will be lost.
  - You are about to drop the column `deviceSize` on the `design_elements` table. All the data in the column will be lost.
  - You are about to drop the `category_designs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `design_elements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device` to the `design_elements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `design_elements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category_designs" DROP CONSTRAINT "category_designs_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "design_elements" DROP CONSTRAINT "design_elements_categoryDesignId_fkey";

-- AlterTable
ALTER TABLE "design_elements" DROP COLUMN "categoryDesignId",
DROP COLUMN "deviceSize",
ADD COLUMN     "backgroundGradient" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "device" "DeviceSize" NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "transitionGradient" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "category_designs";

-- AddForeignKey
ALTER TABLE "design_elements" ADD CONSTRAINT "design_elements_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
