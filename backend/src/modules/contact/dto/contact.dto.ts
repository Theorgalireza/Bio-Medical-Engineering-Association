// dto/contact.dto.ts
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

function toBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return undefined;
}

export class CreateContactDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() subject?: string;
  @IsString() message: string;
}

export class UpdateContactDto {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  read?: boolean;
}

export class QueryContactDto {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  read?: boolean;
  @IsOptional() @IsString() search?: string;
}
