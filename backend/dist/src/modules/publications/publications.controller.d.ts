import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto, QueryPublicationDto } from './dto/publication.dto';
export declare class PublicationsController {
    private readonly service;
    constructor(service: PublicationsService);
    findAll(query: QueryPublicationDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        slug: string;
        title: string;
        issue: string | null;
        category: string;
        summary: string;
        description: string | null;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        downloadUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        slug: string;
        title: string;
        issue: string | null;
        category: string;
        summary: string;
        description: string | null;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        downloadUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreatePublicationDto): Promise<{
        id: string;
        slug: string;
        title: string;
        issue: string | null;
        category: string;
        summary: string;
        description: string | null;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        downloadUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdatePublicationDto): Promise<{
        id: string;
        slug: string;
        title: string;
        issue: string | null;
        category: string;
        summary: string;
        description: string | null;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        downloadUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
