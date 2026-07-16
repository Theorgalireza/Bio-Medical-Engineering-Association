import { Transform } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsOptional, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value?.trim?.() ?? value,
  )
  @IsEmail({}, { message: 'ایمیل واردشده معتبر نیست.' })
  email?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value?.trim?.() ?? value,
  )
  @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل واردشده معتبر نیست.' })
  phone?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'رمز عبور باید ترکیبی از حروف و اعداد انگلیسی باشد.',
  })
  password?: string;
}
