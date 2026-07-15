// dto/article.dto.ts
import { IsString, IsInt, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContentStatus } from '@prisma/client';

function toText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
}

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
  @Transform(({ value }) => toText(value))
  @IsString() title: string;
  @Transform(({ value }) => toText(value))
  @IsString() summary: string;
  @Transform(({ value }) => toText(value))
  @IsString() content: string;
  @Transform(({ value }) => toText(value))
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
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  title?: string;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  summary?: string;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  content?: string;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  category?: string;
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
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  category?: string;
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  featured?: boolean;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  search?: string;
  @IsOptional() @IsString() tag?: string;
}
