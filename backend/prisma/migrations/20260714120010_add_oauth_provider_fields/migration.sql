-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `provider` VARCHAR(191) NULL,
    ADD COLUMN `providerId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `User_provider_providerId_idx` ON `User`(`provider`, `providerId`);
