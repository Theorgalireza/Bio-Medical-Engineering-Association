import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class GalleryService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private logActivity;
    findAll(query: QueryGalleryDto): import(".prisma/client").Prisma.PrismaPromise<({
        uploadedBy: {
            id: string;
            profile: {
                firstName: string | null;
                lastName: string | null;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    })[]>;
    findOne(id: string): Promise<{
        uploadedBy: {
            id: string;
            profile: {
                firstName: string | null;
                lastName: string | null;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }>;
    create(dto: CreateGalleryDto, uploadedById?: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }>;
    update(id: string, dto: UpdateGalleryDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }>;
    remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
}
