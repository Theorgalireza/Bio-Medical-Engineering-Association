import { FacultyService } from './faculty.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
export declare class FacultyController {
    private readonly service;
    constructor(service: FacultyService);
    findAll(query: QueryFacultyDto): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        isActive: boolean;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        isActive: boolean;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    create(req: any, dto: CreateFacultyDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        isActive: boolean;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    update(req: any, id: string, dto: UpdateFacultyDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        isActive: boolean;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
        undoToken: string;
        undoExpiresAt: Date;
    }>;
    restore(req: any, token: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        isActive: boolean;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
}
