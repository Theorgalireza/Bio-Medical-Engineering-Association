import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async track(
    path: string,
    ip?: string,
    userAgent?: string,
    userId?: string,
  ) {
    return this.prisma.pageView.create({
      data: {
        path,
        ip,
        userAgent,
        userId: userId ?? undefined,
      },
    });
  }

  async getStats() {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const [
      totalViews,
      todayViews,
      monthViews,
      uniqueToday,
      topPages,
      weeklyRaw,
    ] = await Promise.all([
      this.prisma.pageView.count(),

      this.prisma.pageView.count({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      this.prisma.pageView.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      this.prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: startOfToday,
          },
        },
        select: {
          ip: true,
        },
        distinct: ['ip'],
      }),

      this.prisma.pageView.groupBy({
        by: ['path'],
        _count: {
          path: true,
        },
        orderBy: {
          _count: {
            path: 'desc',
          },
        },
        take: 5,
      }),

      this.prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    const dailyMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);

      dailyMap.set(date.toISOString().slice(0, 10), 0);
    }

    weeklyRaw.forEach((view) => {
      const date = view.createdAt.toISOString().slice(0, 10);

      if (dailyMap.has(date)) {
        dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1);
      }
    });

    return {
      totalViews,
      todayViews,
      monthViews,
      uniqueTodayVisitors: uniqueToday.length,
      topPages: topPages.map((page) => ({
        path: page.path,
        count: page._count.path,
      })),
      dailyViews: Array.from(dailyMap.entries()).map(([date, count]) => ({
        date,
        count,
      })),
    };
  }
}