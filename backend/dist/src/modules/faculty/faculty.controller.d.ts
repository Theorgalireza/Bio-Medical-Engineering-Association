import { FacultyService } from './faculty.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
export declare class FacultyController {
    private readonly service;
    constructor(service: FacultyService);
    findAll(query: QueryFacultyDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyMemberClient<{
        id: string;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateFacultyDto): Promise<{
        id: string;
        name: string;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
