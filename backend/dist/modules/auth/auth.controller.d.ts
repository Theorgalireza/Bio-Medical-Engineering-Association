import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
declare class ForgotPasswordDto {
    identifier: string;
}
export declare class AuthController {
    private readonly auth;
    private readonly config;
    private readonly activityLog;
    constructor(auth: AuthService, config: ConfigService, activityLog: ActivityLogService);
    private setAuthCookie;
    private redirectToFrontend;
    private logAuthFailure;
    register(dto: RegisterDto, req: any, reply: any): Promise<any>;
    login(dto: LoginDto, req: any, reply: any): Promise<any>;
    sendOtp(dto: SendOtpDto, req: any): Promise<{
        message: string;
    }>;
    forgot(dto: ForgotPasswordDto, req: any): Promise<{
        message: string;
    }>;
    reset(dto: ResetPasswordDto, req: any): Promise<{
        message: string;
    }>;
    logout(req: any, reply: any): Promise<any>;
    googleAuth(): void;
    googleCallback(req: any, reply: any): Promise<any>;
    githubAuth(): void;
    githubCallback(req: any, reply: any): Promise<any>;
    linkedinAuth(): void;
    linkedinCallback(req: any, reply: any): Promise<any>;
}
export {};
