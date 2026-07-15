import { PrismaService } from '../../prisma/prisma.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class FacultyService {
    private readonly prisma;
    private readonly activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private logActivity;
    findAll(query: QueryFacultyDto): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    create(dto: CreateFacultyDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    update(id: string, dto: UpdateFacultyDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        title: string;
        specialties: import("@prisma/client/runtime/library").JsonValue;
        monogram: string;
        color: string;
    }>;
    remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
}
