/*
  Warnings:

  - Made the column `deleted_at` on table `sys_department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deleted_at` on table `sys_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deleted_at` on table `sys_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sys_department` MODIFY `deleted_at` BIGINT UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `sys_role` MODIFY `deleted_at` BIGINT UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `sys_user` MODIFY `deleted_at` BIGINT UNSIGNED NOT NULL DEFAULT 0;
