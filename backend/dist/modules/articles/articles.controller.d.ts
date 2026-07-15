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
        createdAt: Date;
        updatedAt: Date;
        content: string;
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
        content: string;
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
        content: string;
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
        content: string;
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
