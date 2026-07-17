import { PrismaService } from '../../prisma/prisma.service';
export declare class SiteSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        key: string;
        value: string;
        updatedAt: Date;
    }[]>;
    upsert(key: string, value: string): Promise<{
        key: string;
        value: string;
        updatedAt: Date;
    }>;
    bulkUpsert(settings: Record<string, string>): Promise<{
        key: string;
        value: string;
        updatedAt: Date;
    }[]>;
}
