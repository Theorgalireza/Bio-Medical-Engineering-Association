import { ActivityLogService } from './activity-log.service';
export declare class ActivityLogController {
    private readonly service;
    constructor(service: ActivityLogService);
    findAll(page?: string, limit?: string, action?: string, targetType?: string): Promise<import("./activity-log.service").ActivityLogsPage>;
}
