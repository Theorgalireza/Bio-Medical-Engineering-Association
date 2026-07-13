import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
export declare class GalleryController {
    private readonly service;
    constructor(service: GalleryService);
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
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
        createdAt: Date;
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
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
        createdAt: Date;
    }>;
    create(dto: CreateGalleryDto, req: any): import(".prisma/client").Prisma.Prisma__GalleryItemClient<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
