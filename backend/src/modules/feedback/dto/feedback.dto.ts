// dto/feedback.dto.ts
import { IsString, IsInt, IsOptional, IsBoolean, Max, Min } from 'class-validator';
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

export class CreateFeedbackDto {
  @IsString() name: string;
  @IsString() message: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
}

export class UpdateFeedbackDto {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  approved?: boolean;
}

export class QueryFeedbackDto {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  approved?: boolean;
  @IsOptional() @IsString() search?: string;
}
