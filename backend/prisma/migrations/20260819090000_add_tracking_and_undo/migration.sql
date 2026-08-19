ALTER TABLE `Contact` ADD COLUMN `referenceCode` VARCHAR(191) NULL;
ALTER TABLE `Feedback` ADD COLUMN `referenceCode` VARCHAR(191) NULL;

UPDATE `Contact`
SET `referenceCode` = CONCAT('CNT-', UPPER(SUBSTRING(REPLACE(`id`, '-', ''), 1, 10)))
WHERE `referenceCode` IS NULL;

UPDATE `Feedback`
SET `referenceCode` = CONCAT('FDB-', UPPER(SUBSTRING(REPLACE(`id`, '-', ''), 1, 10)))
WHERE `referenceCode` IS NULL;

ALTER TABLE `Contact` MODIFY `referenceCode` VARCHAR(191) NOT NULL;
ALTER TABLE `Feedback` MODIFY `referenceCode` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `Contact_referenceCode_key` ON `Contact`(`referenceCode`);
CREATE UNIQUE INDEX `Feedback_referenceCode_key` ON `Feedback`(`referenceCode`);

CREATE TABLE `DeletedRecord` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,
    `deletedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DeletedRecord_token_key`(`token`),
    INDEX `DeletedRecord_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `DeletedRecord_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
