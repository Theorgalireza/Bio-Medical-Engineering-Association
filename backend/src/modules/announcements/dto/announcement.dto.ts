// dto/announcement.dto.ts
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AnnouncementType, ContentStatus } from '@prisma/client';

export class CreateAnnouncementDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsEnum(AnnouncementType) type: AnnouncementType;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isNew?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
}

export class UpdateAnnouncementDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(AnnouncementType) type?: AnnouncementType;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isNew?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
}

export class QueryAnnouncementDto {
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsEnum(AnnouncementType) type?: AnnouncementType;
  @IsOptional() @IsString() search?: string;
}
