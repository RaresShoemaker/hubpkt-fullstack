-- CreateEnum
CREATE TYPE "DeviceSize" AS ENUM ('mobile', 'tablet', 'desktop');

-- CreateTable
CREATE TABLE "category_designs" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "backgroundGradient" TEXT NOT NULL DEFAULT '',
    "transitionGradient" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "category_designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_elements" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "categoryDesignId" TEXT NOT NULL,
    "deviceSize" "DeviceSize" NOT NULL,
    "imageMetadataId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "design_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "html_elements" (
    "id" TEXT NOT NULL,
    "designElementId" TEXT NOT NULL,
    "htmlTag" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "html_elements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_designs_categoryId_key" ON "category_designs"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "design_elements_imageMetadataId_key" ON "design_elements"("imageMetadataId");

-- AddForeignKey
ALTER TABLE "category_designs" ADD CONSTRAINT "category_designs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_elements" ADD CONSTRAINT "design_elements_categoryDesignId_fkey" FOREIGN KEY ("categoryDesignId") REFERENCES "category_designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_elements" ADD CONSTRAINT "design_elements_imageMetadataId_fkey" FOREIGN KEY ("imageMetadataId") REFERENCES "image_metadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "html_elements" ADD CONSTRAINT "html_elements_designElementId_fkey" FOREIGN KEY ("designElementId") REFERENCES "design_elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
