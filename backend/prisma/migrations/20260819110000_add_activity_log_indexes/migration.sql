CREATE INDEX `ActivityLog_createdAt_idx` ON `ActivityLog`(`createdAt`);
CREATE INDEX `ActivityLog_action_createdAt_idx` ON `ActivityLog`(`action`, `createdAt`);
CREATE INDEX `ActivityLog_targetType_createdAt_idx` ON `ActivityLog`(`targetType`, `createdAt`);
