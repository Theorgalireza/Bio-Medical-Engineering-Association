import { ActivityLog } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export interface LogActivityInput {
    actorId?: string | null;
    actorEmail?: string | null;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    detail?: string | null;
    ip?: string | null;
}
export interface FindAllActivityLogsOptions {
    page?: number;
    limit?: number;
    action?: string;
    targetType?: string;
}
export interface ActivityLogsPage {
    data: ActivityLog[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class ActivityLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(input: LogActivityInput): Promise<void>;
    findAll(options?: FindAllActivityLogsOptions): Promise<ActivityLogsPage>;
}
