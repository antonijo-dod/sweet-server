/*
  Warnings:

  - A unique constraint covering the columns `[recipeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `recipeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Image_recipeId_key` ON `Image`(`recipeId`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
