-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image";
ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN "imageDeleteUrl" TEXT;
