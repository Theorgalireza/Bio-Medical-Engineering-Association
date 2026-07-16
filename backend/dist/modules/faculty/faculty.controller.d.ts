import { FacultyService } from './faculty.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
export declare class FacultyController {
    private readonly service;
    constructor(service: FacultyService);
    findAll(query: QueryFacultyDto): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }>;
    create(req: any, dto: CreateFacultyDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }>;
    update(req: any, id: string, dto: UpdateFacultyDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
