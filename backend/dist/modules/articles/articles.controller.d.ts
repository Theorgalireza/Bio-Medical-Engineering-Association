import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
import { User } from '@prisma/client';
export declare class ArticlesController {
    private readonly service;
    constructor(service: ArticlesService);
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
    create(dto: CreateArticleDto, user: User, req: any): Promise<{
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
    update(req: any, id: string, dto: UpdateArticleDto): Promise<{
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
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
