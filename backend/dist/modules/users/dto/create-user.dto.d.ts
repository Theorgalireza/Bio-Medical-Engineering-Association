import { Role } from '@prisma/client';
export declare class CreateUserDto {
    email?: string;
    phone?: string;
    password: string;
    role: Role;
    firstName?: string;
    lastName?: string;
    studentId?: string;
    university?: string;
    major?: string;
    field?: string;
    entryYear?: number;
    github?: string;
    linkedin?: string;
    website?: string;
    profileEmail?: string;
}
