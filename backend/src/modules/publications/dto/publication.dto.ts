// dto/publication.dto.ts
import { IsString, IsInt, IsOptional, IsArray, IsEnum, IsUrl, IsDateString } from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class CreatePublicationDto {
  @IsString() slug: string;
  @IsString() title: string;
  @IsOptional() @IsString() issue?: string;
  @IsString() category: string;
  @IsString() summary: string;
  @IsOptional() @IsString() description?: string;
  @IsArray() @IsString({ each: true }) authors: string[];
  @IsInt() year: number;
  @IsOptional() @IsString() downloadUrl?: string;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsDateString() publishedAt?: string;
}

export class UpdatePublicationDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() issue?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) authors?: string[];
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsString() downloadUrl?: string;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsDateString() publishedAt?: string;
}

export class QueryPublicationDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsString() search?: string;
}
