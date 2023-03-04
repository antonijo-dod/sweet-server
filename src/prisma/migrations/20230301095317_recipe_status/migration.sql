-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft';
