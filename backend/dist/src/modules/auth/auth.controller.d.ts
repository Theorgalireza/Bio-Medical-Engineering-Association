import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
declare class ForgotPasswordDto {
    identifier: string;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    forgot(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    reset(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
export {};
