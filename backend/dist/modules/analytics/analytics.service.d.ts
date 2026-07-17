import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    track(path: string, ip?: string, userAgent?: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        ip: string | null;
        userId: string | null;
        userAgent: string | null;
    }>;
    getStats(): Promise<{
        totalViews: number;
        todayViews: number;
        monthViews: number;
        uniqueTodayVisitors: number;
        topPages: {
            path: string;
            count: number;
        }[];
        dailyViews: {
            date: string;
            count: number;
        }[];
    }>;
}
