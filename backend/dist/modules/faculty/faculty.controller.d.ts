import { FacultyService } from './faculty.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
export declare class FacultyController {
    private readonly service;
    constructor(service: FacultyService);
    findAll(query: QueryFacultyDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    create(dto: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyMemberClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateFacultyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
