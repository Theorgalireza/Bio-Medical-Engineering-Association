import { ContentStatus } from '@prisma/client';
export declare class CreateArticleDto {
    title: string;
    summary: string;
    content: string;
    category: string;
    authors: string[];
    year: number;
    readingTime?: number;
    featured?: boolean;
    status?: ContentStatus;
    tags?: string[];
}
export declare class UpdateArticleDto {
    title?: string;
    summary?: string;
    content?: string;
    category?: string;
    authors?: string[];
    year?: number;
    readingTime?: number;
    featured?: boolean;
    status?: ContentStatus;
    tags?: string[];
}
export declare class QueryArticleDto {
    status?: ContentStatus;
    category?: string;
    featured?: boolean;
    search?: string;
    tag?: string;
}
