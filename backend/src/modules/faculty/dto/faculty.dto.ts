// dto/faculty.dto.ts
import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateFacultyDto {
  @IsString() name: string;
  @IsString() title: string;
  @IsArray() @IsString({ each: true }) specialties: string[];
  @IsString() monogram: string;
  @IsString() color: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateFacultyDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) specialties?: string[];
  @IsOptional() @IsString() monogram?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class QueryFacultyDto {
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() search?: string;
}
