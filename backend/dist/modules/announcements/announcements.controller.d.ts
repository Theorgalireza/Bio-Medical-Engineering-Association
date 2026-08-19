import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto, QueryAnnouncementDto } from './dto/announcement.dto';
import { User } from '@prisma/client';
export declare class AnnouncementsController {
    private readonly service;
    constructor(service: AnnouncementsService);
    findAll(query: QueryAnnouncementDto): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            id: string;
            profile: {
                firstName: string | null;
                lastName: string | null;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        updatedAt: Date;
    })[]>;
    findAllAdmin(query: QueryAnnouncementDto): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            id: string;
            profile: {
                firstName: string | null;
                lastName: string | null;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        updatedAt: Date;
    })[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        updatedAt: Date;
    }>;
    create(dto: CreateAnnouncementDto, user: User, req: any): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        updatedAt: Date;
    }>;
    update(req: any, id: string, dto: UpdateAnnouncementDto): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        updatedAt: Date;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
        undoToken: string;
        undoExpiresAt: Date;
    }>;
    restore(req: any, token: string): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        updatedAt: Date;
    }>;
}
