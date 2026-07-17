import { PrismaService } from '../../prisma/prisma.service';
export declare class SiteSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
    upsert(key: string, value: string): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    bulkUpsert(settings: Record<string, string>): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}
