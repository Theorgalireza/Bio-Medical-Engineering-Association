// dto/faculty.dto.ts
import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
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

export class CreateFacultyDto {
  @IsString() name: string;
  @IsString() title: string;
  @IsArray() @IsString({ each: true }) specialties: string[];
  @IsString() monogram: string;
  @IsString() color: string;
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateFacultyDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) specialties?: string[];
  @IsOptional() @IsString() monogram?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isActive?: boolean;
}

export class QueryFacultyDto {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isActive?: boolean;
  @IsOptional() @IsString() search?: string;
}
