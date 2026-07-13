import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
export declare class FeedbackService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryFeedbackDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
    }>;
    create(dto: CreateFeedbackDto): import(".prisma/client").Prisma.Prisma__FeedbackClient<{
        id: string;
        createdAt: Date;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateFeedbackDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        message: string;
        rating: number | null;
        approved: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
