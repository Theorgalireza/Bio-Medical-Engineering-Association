import { IsString, IsNotEmpty, IsObject, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UpsertSettingDto {
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class BulkUpsertDto {
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value !== "object" || value === null) return value;
    return Object.fromEntries(
      Object.entries(value).filter(
        ([k, v]) => typeof k === "string" && typeof v === "string",
      ),
    );
  })
  settings!: Record<string, string>;
}
