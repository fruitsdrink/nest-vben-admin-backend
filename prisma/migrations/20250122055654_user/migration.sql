/*
  Warnings:

  - You are about to drop the column `last_login_time` on the `sys_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `last_login_time`,
    ADD COLUMN `last_login_at` DATETIME(3) NULL;
