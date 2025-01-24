/*
  Warnings:

  - You are about to drop the column `roleId` on the `sys_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username,deleted_at]` on the table `sys_user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `sys_user` DROP FOREIGN KEY `sys_user_roleId_fkey`;

-- DropIndex
DROP INDEX `sys_user_roleId_fkey` ON `sys_user`;

-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `roleId`;

-- CreateTable
CREATE TABLE `_RoleToUser` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `_RoleToUser_AB_unique`(`A`, `B`),
    INDEX `_RoleToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `sys_user_username_deleted_at_key` ON `sys_user`(`username`, `deleted_at`);

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
