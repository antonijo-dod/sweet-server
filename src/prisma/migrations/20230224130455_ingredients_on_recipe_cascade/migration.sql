-- DropForeignKey
ALTER TABLE `IngredientsOnRecipe` DROP FOREIGN KEY `IngredientsOnRecipe_recipeId_fkey`;

-- AddForeignKey
ALTER TABLE `IngredientsOnRecipe` ADD CONSTRAINT `IngredientsOnRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
