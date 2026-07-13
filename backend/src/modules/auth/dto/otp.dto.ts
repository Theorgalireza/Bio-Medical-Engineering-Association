// src/modules/auth/dto/otp.dto.ts
import { IsMobilePhone, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsMobilePhone('fa-IR')
  phone: string;
}

export class VerifyOtpDto {
  @IsMobilePhone('fa-IR')
  phone: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
