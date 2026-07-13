import { PrismaService } from '../../prisma/prisma.service';
import { CreatePublicationDto, UpdatePublicationDto, QueryPublicationDto } from './dto/publication.dto';
export declare class PublicationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryPublicationDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        description: string | null;
        issue: string | null;
        downloadUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        description: string | null;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        description: string | null;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    create(dto: CreatePublicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        description: string | null;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    update(id: string, dto: UpdatePublicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        summary: string;
        category: string;
        authors: import("@prisma/client/runtime/library").JsonValue;
        year: number;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        description: string | null;
        issue: string | null;
        downloadUrl: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
