/*
  Warnings:

  - Made the column `nickname` on table `sys_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sys_user` MODIFY `nickname` VARCHAR(191) NOT NULL;
