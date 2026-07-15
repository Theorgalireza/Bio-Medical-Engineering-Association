import { Injectable } from '@nestjs/common';
import { ActivityLog, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogActivityInput {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  detail?: string | null;
  ip?: string | null;
}

export interface FindAllActivityLogsOptions {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
}

export interface ActivityLogsPage {
  data: ActivityLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: LogActivityInput): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          actorId: input.actorId ?? null,
          actorEmail: input.actorEmail ?? null,
          action: input.action,
          targetType: input.targetType ?? null,
          targetId: input.targetId ?? null,
          detail: input.detail ?? null,
          ip: input.ip ?? null,
        },
      });
    } catch (error) {
      console.error('Failed to write activity log', error);
    }
  }

  async findAll(options: FindAllActivityLogsOptions = {}): Promise<ActivityLogsPage> {
    const rawPage = Number(options.page ?? 1);
    const rawLimit = Number(options.limit ?? 20);
    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const limit = Number.isFinite(rawLimit) ? Math.min(200, Math.max(1, rawLimit)) : 20;
    const where: Prisma.ActivityLogWhereInput = {};

    if (options.action) {
      where.action = options.action;
    }

    if (options.targetType) {
      where.targetType = options.targetType;
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.activityLog.count({ where }),
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
}
