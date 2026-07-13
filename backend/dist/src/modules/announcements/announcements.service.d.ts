import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateAnnouncementDto, UpdateAnnouncementDto, QueryAnnouncementDto } from './dto/announcement.dto';
export declare class AnnouncementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
