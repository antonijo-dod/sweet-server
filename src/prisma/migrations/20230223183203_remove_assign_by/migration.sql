/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `IngredientsOnRecipe` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `IngredientsOnRecipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `IngredientsOnRecipe` DROP COLUMN `assignedAt`,
    DROP COLUMN `assignedBy`;
