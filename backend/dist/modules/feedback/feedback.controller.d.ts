import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
export declare class FeedbackController {
    private readonly service;
    constructor(service: FeedbackService);
    findAll(query: QueryFeedbackDto): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        message: string;
        rating: number | null;
        approved: boolean;
    }[]>;
    findApproved(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        message: string;
        rating: number | null;
        approved: boolean;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        message: string;
        rating: number | null;
        approved: boolean;
    }>;
    create(req: any, dto: CreateFeedbackDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        message: string;
        rating: number | null;
        approved: boolean;
    }>;
    update(req: any, id: string, dto: UpdateFeedbackDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        message: string;
        rating: number | null;
        approved: boolean;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
