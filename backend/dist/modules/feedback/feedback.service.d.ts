import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class FeedbackService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private logActivity;
    findAll(query: QueryFeedbackDto): import(".prisma/client").Prisma.PrismaPromise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }[]>;
    findOne(id: string): Promise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }>;
    create(dto: CreateFeedbackDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }>;
    update(id: string, dto: UpdateFeedbackDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }>;
    remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
}
