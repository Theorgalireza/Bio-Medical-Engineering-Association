import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
export declare class GalleryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        category: string | null;
        description: string | null;
        imageUrl: string;
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
        category: string | null;
        description: string | null;
        imageUrl: string;
        uploadedById: string | null;
    }>;
    create(dto: CreateGalleryDto, uploadedById?: string): import(".prisma/client").Prisma.Prisma__GalleryItemClient<{
        id: string;
        createdAt: Date;
        title: string;
        category: string | null;
        description: string | null;
        imageUrl: string;
        uploadedById: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        category: string | null;
        description: string | null;
        imageUrl: string;
        uploadedById: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
