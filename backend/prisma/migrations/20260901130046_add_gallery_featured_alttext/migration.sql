-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "altText" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "GalleryImage_isFeatured_idx" ON "GalleryImage"("isFeatured");
