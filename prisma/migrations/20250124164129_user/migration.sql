-- AlterTable
ALTER TABLE `sys_user` ADD COLUMN `is_admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `realName` VARCHAR(191) NULL;
