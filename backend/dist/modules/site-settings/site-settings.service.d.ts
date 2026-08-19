import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class SiteSettingsService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
    upsert(key: string, value: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    bulkUpsert(settings: Record<string, string>, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}
