// src/modules/auth/dto/register.dto.ts
import { IsEmail, IsOptional, IsMobilePhone, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone('fa-IR')
  phone?: string;

  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain letters and numbers',
  })
  password?: string;
}
