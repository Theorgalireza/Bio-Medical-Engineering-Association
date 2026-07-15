// dto/announcement.dto.ts
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { AnnouncementType, ContentStatus } from '@prisma/client';

function toText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value);
}

export class CreateAnnouncementDto {
  @Transform(({ value }) => toText(value))
  @IsString() title: string;
  @Transform(({ value }) => toText(value))
  @IsString() description: string;
  @IsEnum(AnnouncementType) type: AnnouncementType;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  imageUrl?: string;
  @IsOptional() @IsBoolean() isNew?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
}

export class UpdateAnnouncementDto {
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  title?: string;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  description?: string;
  @IsOptional() @IsEnum(AnnouncementType) type?: AnnouncementType;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  imageUrl?: string;
  @IsOptional() @IsBoolean() isNew?: boolean;
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
}

export class QueryAnnouncementDto {
  @IsOptional() @IsEnum(ContentStatus) status?: ContentStatus;
  @IsOptional() @IsEnum(AnnouncementType) type?: AnnouncementType;
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? undefined : toText(value)))
  @IsString()
  search?: string;
}
