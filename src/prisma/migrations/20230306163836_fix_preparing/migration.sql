/*
  Warnings:

  - You are about to drop the column `preparationTime` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `preparationTime`,
    ADD COLUMN `preparingTime` INTEGER NULL;
