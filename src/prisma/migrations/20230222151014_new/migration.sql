/*
  Warnings:

  - You are about to drop the `IngredientsOnRecipe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `IngredientsOnRecipe` DROP FOREIGN KEY `IngredientsOnRecipe_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `IngredientsOnRecipe` DROP FOREIGN KEY `IngredientsOnRecipe_recipeId_fkey`;

-- AlterTable
ALTER TABLE `Ingredient` ADD COLUMN `amount` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `IngredientsOnRecipe`;

-- CreateTable
CREATE TABLE `_IngredientToRecipe` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_IngredientToRecipe_AB_unique`(`A`, `B`),
    INDEX `_IngredientToRecipe_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_IngredientToRecipe` ADD CONSTRAINT `_IngredientToRecipe_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IngredientToRecipe` ADD CONSTRAINT `_IngredientToRecipe_B_fkey` FOREIGN KEY (`B`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
