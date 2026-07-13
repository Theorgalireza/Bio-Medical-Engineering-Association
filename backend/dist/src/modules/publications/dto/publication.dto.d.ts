import { ContentStatus } from '@prisma/client';
export declare class CreatePublicationDto {
    slug: string;
    title: string;
    issue?: string;
    category: string;
    summary: string;
    description?: string;
    authors: string[];
    year: number;
    downloadUrl?: string;
    status?: ContentStatus;
    publishedAt?: string;
}
export declare class UpdatePublicationDto {
    title?: string;
    issue?: string;
    category?: string;
    summary?: string;
    description?: string;
    authors?: string[];
    year?: number;
    downloadUrl?: string;
    status?: ContentStatus;
    publishedAt?: string;
}
export declare class QueryPublicationDto {
    category?: string;
    status?: ContentStatus;
    search?: string;
}
