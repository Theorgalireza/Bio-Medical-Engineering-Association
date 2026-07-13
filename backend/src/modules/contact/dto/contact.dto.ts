// dto/contact.dto.ts
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateContactDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() subject?: string;
  @IsString() message: string;
}

export class UpdateContactDto {
  @IsOptional() @IsBoolean() read?: boolean;
}

export class QueryContactDto {
  @IsOptional() @IsBoolean() read?: boolean;
  @IsOptional() @IsString() search?: string;
}
