import { SiteSettingsService } from './site-settings.service';
import { UpsertSettingDto, BulkUpsertDto } from './dto/site-setting.dto';
export declare class SiteSettingsController {
    private readonly service;
    constructor(service: SiteSettingsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        key: string;
        value: string;
        updatedAt: Date;
    }[]>;
    upsert(key: string, dto: UpsertSettingDto): Promise<{
        key: string;
        value: string;
        updatedAt: Date;
    }>;
    bulkUpsert(dto: BulkUpsertDto): Promise<{
        key: string;
        value: string;
        updatedAt: Date;
    }[]>;
}
