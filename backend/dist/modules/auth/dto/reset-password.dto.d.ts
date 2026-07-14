export declare class ForgotPasswordDto {
    email?: string;
    phone?: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
