import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
export declare class FeedbackController {
    private readonly service;
    constructor(service: FeedbackService);
    findAll(query: QueryFeedbackDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
        createdAt: Date;
    }[]>;
    findApproved(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
        createdAt: Date;
    }>;
    create(dto: CreateFeedbackDto): import(".prisma/client").Prisma.Prisma__FeedbackClient<{
        id: string;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateFeedbackDto): Promise<{
        id: string;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
