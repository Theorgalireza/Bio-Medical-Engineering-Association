// backend/src/modules/newsletter/dto/newsletter.dto.ts
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class SubscribeDto {
  @IsEmail() email!: string;
  @IsOptional() @IsString() name?: string;
}

export class SendCampaignDto {
  @IsString() subject!: string;
  @IsString() body!: string;
}

export class UnsubscribeDto {
  @IsUUID() token!: string;
}
