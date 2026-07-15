import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class ArticlesService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private logActivity;
    findAll(query: QueryArticleDto): import(".prisma/client").Prisma.PrismaPromise<({
        tags: ({
            tag: {
                name: string;
                id: string;
            };
        } & {
            tagId: string;
            articleId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
    })[]>;
    findBySlug(slug: string): Promise<{
        tags: ({
            tag: {
                name: string;
                id: string;
            };
        } & {
            tagId: string;
            articleId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
    }>;
    create(dto: CreateArticleDto, user: User, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        tags: ({
            tag: {
                name: string;
                id: string;
            };
        } & {
            tagId: string;
            articleId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
    }>;
    update(id: string, dto: UpdateArticleDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        tags: ({
            tag: {
                name: string;
                id: string;
            };
        } & {
            tagId: string;
            articleId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
    }>;
    remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
    private resolveTagConnects;
}
