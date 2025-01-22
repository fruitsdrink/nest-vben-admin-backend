/*
  Warnings:

  - You are about to drop the column `jwt_token` on the `sys_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `jwt_token`,
    ADD COLUMN `access_token` VARCHAR(191) NULL,
    ADD COLUMN `refresh_token` VARCHAR(191) NULL;
