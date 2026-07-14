import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from './sms/sms.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
    constructor(prisma: PrismaService, jwt: JwtService, smsService: SmsService);
    register(dto: RegisterDto): Promise<AuthResult>;
    login(dto: LoginDto): Promise<AuthResult>;
    private loginWithPassword;
    private loginWithOtp;
    sendOtp(phone: string): Promise<{
        message: string;
    }>;
    forgotPassword(identifier: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    oauthLogin(profile: OAuthProfilePayload): Promise<AuthResult>;
    private signToken;
}
export {};
