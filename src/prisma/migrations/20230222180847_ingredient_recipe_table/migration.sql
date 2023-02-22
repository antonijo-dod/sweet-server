/*
  Warnings:

  - You are about to drop the column `amount` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the `_IngredientToRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_IngredientToRecipe` DROP FOREIGN KEY `_IngredientToRecipe_A_fkey`;

-- DropForeignKey
ALTER TABLE `_IngredientToRecipe` DROP FOREIGN KEY `_IngredientToRecipe_B_fkey`;

-- AlterTable
ALTER TABLE `Ingredient` DROP COLUMN `amount`;

-- DropTable
DROP TABLE `_IngredientToRecipe`;

-- CreateTable
CREATE TABLE `IngredientsOnRecipe` (
    `recipeId` INTEGER NOT NULL,
    `ingredientId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`recipeId`, `ingredientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IngredientsOnRecipe` ADD CONSTRAINT `IngredientsOnRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngredientsOnRecipe` ADD CONSTRAINT `IngredientsOnRecipe_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
