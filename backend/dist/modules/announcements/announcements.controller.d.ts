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
        updatedAt: Date;
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
    })[]>;
    findBySlug(slug: string): Promise<{
        updatedAt: Date;
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
    }>;
    create(dto: CreateAnnouncementDto, user: User, req: any): Promise<{
        updatedAt: Date;
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
    }>;
    update(req: any, id: string, dto: UpdateAnnouncementDto): Promise<{
        updatedAt: Date;
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
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
