/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[featuredImageId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_recipeId_fkey`;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `recipeId`;

-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `featuredImageId` INTEGER NULL,
    ADD COLUMN `recipeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Recipe_featuredImageId_key` ON `Recipe`(`featuredImageId`);

-- CreateIndex
CREATE UNIQUE INDEX `Recipe_recipeId_key` ON `Recipe`(`recipeId`);

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_featuredImageId_fkey` FOREIGN KEY (`featuredImageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
