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
    upsert(key: string, dto: UpsertSettingDto, req: any): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    bulkUpsert(dto: BulkUpsertDto, req: any): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}
