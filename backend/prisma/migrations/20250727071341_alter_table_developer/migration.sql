/*
  Warnings:

  - Added the required column `birthDate` to the `developers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hobby` to the `developers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `developers` ADD COLUMN `birthDate` DATETIME(3) NOT NULL,
    ADD COLUMN `hobby` VARCHAR(191) NOT NULL;
