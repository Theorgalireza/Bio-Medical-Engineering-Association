import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    actorId?: string;
    actorEmail?: string;
    action: string;
    targetType?: string;
    targetId?: string;
    detail?: string;
    ip?: string;
  }) {
    return this.prisma.activityLog.create({ data });
  }

  async findAll(limit = 200) {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
