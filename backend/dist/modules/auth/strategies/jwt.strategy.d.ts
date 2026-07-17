import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        role: string;
    }): Promise<{
        profile: {
            id: string;
            github: string | null;
            linkedin: string | null;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            studentId: string | null;
            university: string | null;
            major: string | null;
            field: string | null;
            entryYear: number | null;
            website: string | null;
            profileEmail: string | null;
        } | null;
    } & {
        id: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        phone: string | null;
        passwordHash: string | null;
        role: import(".prisma/client").$Enums.Role;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        updatedAt: Date;
    }>;
}
export {};
