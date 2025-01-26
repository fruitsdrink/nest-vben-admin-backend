/*
  Warnings:

  - You are about to drop the column `nickname` on the `sys_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `nickname`,
    ADD COLUMN `nick_name` VARCHAR(191) NOT NULL DEFAULT '用户';
