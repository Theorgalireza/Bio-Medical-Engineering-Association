// dto/article.dto.ts
import { IsString, IsInt, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class CreateArticleDto {
  @IsString() title: string;
  @IsString() summary: string;
  @IsString() content: string;
  @IsString() category: string;
  @IsArray() @IsString({ each: true }) authors: string[];
  @IsInt() year: number;
  @IsOptional() @IsInt() readingTime?: number;
  @IsOptional() @IsBoolean() featured?: boolean;
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
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class QueryArticleDto {
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() tag?: string;
}
