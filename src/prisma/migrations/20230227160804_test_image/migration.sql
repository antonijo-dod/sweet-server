/*
  Warnings:

  - You are about to drop the `ImageOnRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ImageOnRecipe` DROP FOREIGN KEY `ImageOnRecipe_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `ImageOnRecipe` DROP FOREIGN KEY `ImageOnRecipe_recipeId_fkey`;

-- DropTable
DROP TABLE `ImageOnRecipe`;

-- CreateTable
CREATE TABLE `_ImageToRecipe` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ImageToRecipe_AB_unique`(`A`, `B`),
    INDEX `_ImageToRecipe_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ImageToRecipe` ADD CONSTRAINT `_ImageToRecipe_A_fkey` FOREIGN KEY (`A`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ImageToRecipe` ADD CONSTRAINT `_ImageToRecipe_B_fkey` FOREIGN KEY (`B`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
