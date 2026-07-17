import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.siteSetting.findMany();
  }

  async upsert(key: string, value: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async bulkUpsert(settings: Record<string, string>) {
    const ops = Object.entries(settings).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );
    return this.prisma.$transaction(ops);
  }
}
