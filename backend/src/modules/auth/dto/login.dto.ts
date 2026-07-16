import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail({}, { message: 'ایمیل واردشده معتبر نیست.' })
  email?: string;

  @IsOptional()
  @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل واردشده معتبر نیست.' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(6, 6)
  otp?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' })
  password?: string;
}