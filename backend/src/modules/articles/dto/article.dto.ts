// dto/article.dto.ts
import { IsString, IsInt, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContentStatus } from '@prisma/client';

function toBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return undefined;
}

export class CreateArticleDto {
  @IsString() title: string;
  @IsString() summary: string;
  @IsString() content: string;
  @IsString() category: string;
  @IsArray() @IsString({ each: true }) authors: string[];
  @IsInt() year: number;
  @IsOptional() @IsInt() readingTime?: number;
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  featured?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class UpdateArticleDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) authors?: string[];
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsInt() readingTime?: number;
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  featured?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class QueryArticleDto {
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsString() category?: string;
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  featured?: boolean;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() tag?: string;
}
