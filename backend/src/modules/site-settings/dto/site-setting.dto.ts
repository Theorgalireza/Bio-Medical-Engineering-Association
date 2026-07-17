import { IsString, IsNotEmpty } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class BulkUpsertDto {
  settings!: Record<string, string>;
}
