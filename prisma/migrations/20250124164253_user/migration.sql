/*
  Warnings:

  - You are about to drop the column `realName` on the `sys_user` table. All the data in the column will be lost.
  - You are about to alter the column `is_admin` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `realName`,
    ADD COLUMN `real_name` VARCHAR(191) NULL,
    MODIFY `is_admin` INTEGER UNSIGNED NOT NULL DEFAULT 0;
