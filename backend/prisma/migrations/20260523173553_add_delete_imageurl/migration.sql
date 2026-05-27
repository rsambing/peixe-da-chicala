/*
  Warnings:

  - You are about to drop the column `deleteImage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "deleteImage",
DROP COLUMN "image",
ADD COLUMN     "imageDeleteUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT;
