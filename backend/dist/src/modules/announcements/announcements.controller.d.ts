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
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
    })[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
    }>;
    create(dto: CreateAnnouncementDto, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
    }>;
    update(id: string, dto: UpdateAnnouncementDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        publishedAt: Date | null;
        authorId: string | null;
        description: string;
        imageUrl: string | null;
        type: import(".prisma/client").$Enums.AnnouncementType;
        isNew: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
