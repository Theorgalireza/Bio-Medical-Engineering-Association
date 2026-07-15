import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
export declare class GalleryController {
    private readonly service;
    constructor(service: GalleryService);
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
    create(dto: CreateGalleryDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }>;
    update(req: any, id: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        imageUrl: string;
        category: string | null;
        uploadedById: string | null;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
