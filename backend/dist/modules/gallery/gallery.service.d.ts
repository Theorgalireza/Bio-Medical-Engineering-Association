import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
export declare class GalleryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryGalleryDto): import(".prisma/client").Prisma.PrismaPromise<({
        uploadedBy: {
            profile: {
                firstName: string | null;
                lastName: string | null;
            } | null;
            id: string;
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
            profile: {
                firstName: string | null;
                lastName: string | null;
            } | null;
            id: string;
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
    create(dto: CreateGalleryDto, uploadedById?: string): import(".prisma/client").Prisma.Prisma__GalleryItemClient<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
