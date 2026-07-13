import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
import { User } from '@prisma/client';
export declare class ArticlesController {
    private readonly service;
    constructor(service: ArticlesService);
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
        createdAt: Date;
        updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
