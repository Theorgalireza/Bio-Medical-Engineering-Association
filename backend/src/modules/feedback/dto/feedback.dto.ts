// dto/feedback.dto.ts
import { IsString, IsInt, IsOptional, IsBoolean, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsString() name: string;
  @IsString() message: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
}

export class UpdateFeedbackDto {
  @IsOptional() @IsBoolean() approved?: boolean;
}

export class QueryFeedbackDto {
  @IsOptional() @IsBoolean() approved?: boolean;
  @IsOptional() @IsString() search?: string;
}
