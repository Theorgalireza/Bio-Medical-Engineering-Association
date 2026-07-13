import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly userSelect;
    findAll(): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        profile: {
            id: string;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            studentId: string | null;
            university: string | null;
            major: string | null;
            field: string | null;
            entryYear: number | null;
            github: string | null;
            linkedin: string | null;
            website: string | null;
            profileEmail: string | null;
        } | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        profile: {
            id: string;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            studentId: string | null;
            university: string | null;
            major: string | null;
            field: string | null;
            entryYear: number | null;
            github: string | null;
            linkedin: string | null;
            website: string | null;
            profileEmail: string | null;
        } | null;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        profile: {
            id: string;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            studentId: string | null;
            university: string | null;
            major: string | null;
            field: string | null;
            entryYear: number | null;
            github: string | null;
            linkedin: string | null;
            website: string | null;
            profileEmail: string | null;
        } | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        studentId: string | null;
        university: string | null;
        major: string | null;
        field: string | null;
        entryYear: number | null;
        github: string | null;
        linkedin: string | null;
        website: string | null;
        profileEmail: string | null;
    }>;
    updateRole(id: string, dto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        profile: {
            id: string;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            studentId: string | null;
            university: string | null;
            major: string | null;
            field: string | null;
            entryYear: number | null;
            github: string | null;
            linkedin: string | null;
            website: string | null;
            profileEmail: string | null;
        } | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    countByRole(): Promise<{
        role: "OWNER" | "ADMIN" | "CONTENT_EDITOR" | "STUDENT_MEMBER" | "STUDENT_ACTIVE_MEMBER" | "STUDENT_INACTIVE_MEMBER" | "FACULTY_MEMBER" | "GUEST";
        count: number;
    }[]>;
}
