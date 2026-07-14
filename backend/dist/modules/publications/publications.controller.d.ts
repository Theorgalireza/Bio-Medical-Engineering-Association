import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto, QueryPublicationDto } from './dto/publication.dto';
export declare class PublicationsController {
    private readonly service;
    constructor(service: PublicationsService);
    findAll(query: QueryPublicationDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        issue: string | null;
        downloadUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    create(dto: CreatePublicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    update(id: string, dto: UpdatePublicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
