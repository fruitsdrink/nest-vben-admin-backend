-- CreateTable
CREATE TABLE `sys_user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `gender` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `sort` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `openid` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` BIGINT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` BIGINT NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` BIGINT NULL,
    `last_login_time` DATETIME(3) NULL,
    `department_id` INTEGER UNSIGNED NULL,
    `roleId` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `sys_user_email_deleted_at_key`(`email`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_department` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `leader` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `sort` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `remark` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` BIGINT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` BIGINT NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` BIGINT NULL,
    `parent_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `sys_department_name_deleted_at_key`(`name`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `sort` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `remark` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` BIGINT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` BIGINT NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_user` ADD CONSTRAINT `sys_user_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `sys_department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user` ADD CONSTRAINT `sys_user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `sys_role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_department` ADD CONSTRAINT `sys_department_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `sys_department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
