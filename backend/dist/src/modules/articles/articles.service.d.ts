import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
export declare class ArticlesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryArticleDto): import(".prisma/client").Prisma.PrismaPromise<({
        tags: ({
            tag: {
                id: string;
                name: string;
            };
        } & {
            articleId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        content: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        tags: ({
            tag: {
                id: string;
                name: string;
            };
        } & {
            articleId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        content: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
    }>;
    create(dto: CreateArticleDto, user: User): Promise<{
        tags: ({
            tag: {
                id: string;
                name: string;
            };
        } & {
            articleId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        content: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
    }>;
    update(id: string, dto: UpdateArticleDto): Promise<{
        tags: ({
            tag: {
                id: string;
                name: string;
            };
        } & {
            articleId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        content: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        readingTime: number | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private resolveTagConnects;
}
