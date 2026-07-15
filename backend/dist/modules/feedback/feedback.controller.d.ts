import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
export declare class FeedbackController {
    private readonly service;
    constructor(service: FeedbackService);
    findAll(query: QueryFeedbackDto): import(".prisma/client").Prisma.PrismaPromise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }[]>;
    findApproved(): import(".prisma/client").Prisma.PrismaPromise<{
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
    create(req: any, dto: CreateFeedbackDto): Promise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }>;
    update(req: any, id: string, dto: UpdateFeedbackDto): Promise<{
        message: string;
        name: string;
        id: string;
        createdAt: Date;
        rating: number | null;
        approved: boolean;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
