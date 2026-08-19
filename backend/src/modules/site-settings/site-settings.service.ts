import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLog: ActivityLogService,
  ) {}

  findAll() {
    return this.prisma.siteSetting.findMany();
  }

  async upsert(key: string, value: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const result = await this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    await this.activityLog.log({
      actorId, actorEmail, action: 'UPDATE_SITE_SETTING', targetType: 'SiteSetting',
      targetId: key, detail: `Updated site setting '${key}'`, ip,
    });
    return result;
  }

  async bulkUpsert(settings: Record<string, string>, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const ops = Object.entries(settings).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );
    const result = await this.prisma.$transaction(ops);
    await this.activityLog.log({
      actorId, actorEmail, action: 'UPDATE_SITE_SETTINGS', targetType: 'SiteSetting',
      detail: `Updated ${Object.keys(settings).length} site settings`, ip,
    });
    return result;
  }
}
