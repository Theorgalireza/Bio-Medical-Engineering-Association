import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from './sms/sms.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
type OAuthProvider = 'google' | 'github' | 'linkedin';
interface OAuthProfilePayload {
    provider: OAuthProvider;
    providerId: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    displayName?: string | null;
}
interface AuthResult {
    access_token: string;
    user: {
        id: string;
        email: string | null;
        role: string;
    };
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly smsService;
    private readonly activityLog;
    constructor(prisma: PrismaService, jwt: JwtService, smsService: SmsService, activityLog: ActivityLogService);
    private logAuthAction;
    register(dto: RegisterDto, actorId?: string | null, ip?: string | null): Promise<AuthResult>;
    login(dto: LoginDto, actorId?: string | null, ip?: string | null): Promise<AuthResult>;
    private authenticateWithPassword;
    private loginWithPassword;
    private loginWithOtp;
    sendOtp(phone: string, actorId?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
    forgotPassword(identifier: string, actorId?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string, actorId?: string | null, ip?: string | null): Promise<{
        message: string;
    }>;
    oauthLogin(profile: OAuthProfilePayload, actorId?: string | null, ip?: string | null): Promise<AuthResult>;
    private signToken;
}
export {};
