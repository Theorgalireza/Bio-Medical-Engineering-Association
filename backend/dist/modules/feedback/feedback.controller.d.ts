import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
export declare class FeedbackController {
    private readonly service;
    constructor(service: FeedbackService);
    findAll(query: QueryFeedbackDto): import(".prisma/client").Prisma.PrismaPromise<{
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        rating: number | null;
        approved: boolean;
    }[]>;
    findApproved(): import(".prisma/client").Prisma.PrismaPromise<{
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        rating: number | null;
        approved: boolean;
    }[]>;
    findOne(id: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        rating: number | null;
        approved: boolean;
    }>;
    create(dto: CreateFeedbackDto): import(".prisma/client").Prisma.Prisma__FeedbackClient<{
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        rating: number | null;
        approved: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateFeedbackDto): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        name: string;
        rating: number | null;
        approved: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
