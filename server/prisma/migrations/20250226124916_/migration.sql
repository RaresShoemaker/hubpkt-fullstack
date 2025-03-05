-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "href" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "previewTitle" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "title" SET DEFAULT '';
