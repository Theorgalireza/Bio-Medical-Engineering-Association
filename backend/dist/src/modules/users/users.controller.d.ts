import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
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
    updateMyProfile(req: any, dto: UpdateProfileDto): Promise<{
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
    countByRole(): Promise<{
        role: "OWNER" | "ADMIN" | "CONTENT_EDITOR" | "STUDENT_MEMBER" | "STUDENT_ACTIVE_MEMBER" | "STUDENT_INACTIVE_MEMBER" | "FACULTY_MEMBER" | "GUEST";
        count: number;
    }[]>;
    findOne(id: string): Promise<{
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
}
