import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
declare class ForgotPasswordDto {
    identifier: string;
}
export declare class AuthController {
    private readonly auth;
    private readonly config;
    constructor(auth: AuthService, config: ConfigService);
    private setAuthCookie;
    private redirectToFrontend;
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
    logout(reply: any): any;
    googleAuth(): void;
    googleCallback(req: any, reply: any): Promise<any>;
    githubAuth(): void;
    githubCallback(req: any, reply: any): Promise<any>;
    linkedinAuth(): void;
    linkedinCallback(req: any, reply: any): Promise<any>;
}
export {};
