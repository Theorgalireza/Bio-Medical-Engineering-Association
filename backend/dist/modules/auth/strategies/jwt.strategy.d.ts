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
            github: string | null;
            linkedin: string | null;
            id: string;
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
        email: string | null;
        phone: string | null;
        id: string;
        passwordHash: string | null;
        role: import(".prisma/client").$Enums.Role;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
}
export {};
