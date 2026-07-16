import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { TrackVisitDto } from './dto/track-visit.dto';
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    track(dto: TrackVisitDto, req: Request, user?: {
        id: string;
    }): Promise<{
        id: string;
        path: string;
        ip: string | null;
        userAgent: string | null;
        createdAt: Date;
        userId: string | null;
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
