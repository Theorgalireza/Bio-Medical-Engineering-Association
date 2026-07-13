import { PrismaService } from '../../prisma/prisma.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
export declare class FacultyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryFacultyDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }>;
    create(dto: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyMemberClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateFacultyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        title: string;
        monogram: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        color: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
