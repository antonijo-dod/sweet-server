/*
  Warnings:

  - You are about to drop the `_ImageToRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ImageToRecipe` DROP FOREIGN KEY `_ImageToRecipe_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ImageToRecipe` DROP FOREIGN KEY `_ImageToRecipe_B_fkey`;

-- DropTable
DROP TABLE `_ImageToRecipe`;

-- CreateTable
CREATE TABLE `ImageOnRecipe` (
    `imageId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,

    PRIMARY KEY (`imageId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageOnRecipe` ADD CONSTRAINT `ImageOnRecipe_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageOnRecipe` ADD CONSTRAINT `ImageOnRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
