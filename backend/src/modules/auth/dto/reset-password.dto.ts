// src/modules/auth/dto/reset-password.dto.ts
import { IsEmail, IsOptional, IsMobilePhone, IsString, MinLength, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone('fa-IR')
  phone?: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain letters and numbers',
  })
  newPassword: string;
}
