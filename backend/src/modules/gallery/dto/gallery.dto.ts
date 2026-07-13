// dto/gallery.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateGalleryDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsString() imageUrl: string;
  @IsOptional() @IsString() category?: string;
}

export class UpdateGalleryDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() category?: string;
}

export class QueryGalleryDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() search?: string;
}
