import { SiteSettingsService } from './site-settings.service';
import { UpsertSettingDto, BulkUpsertDto } from './dto/site-settings.dto';
export declare class SiteSettingsController {
    private readonly service;
    constructor(service: SiteSettingsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
    upsert(key: string, dto: UpsertSettingDto): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    bulkUpsert(dto: BulkUpsertDto): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}
