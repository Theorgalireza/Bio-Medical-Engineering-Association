import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { SubscribeDto, SendCampaignDto } from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  async subscribe(dto: SubscribeDto) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      if (existing.isActive) throw new BadRequestException('این ایمیل قبلاً ثبت شده است.');
      return this.prisma.newsletterSubscriber.update({
        where: { email: dto.email },
        data: { isActive: true, name: dto.name },
      });
    }

    return this.prisma.newsletterSubscriber.create({ data: dto });
  }

  async unsubscribe(token: string) {
    const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { token } });
    if (!sub) throw new NotFoundException('لینک نامعتبر است.');
    return this.prisma.newsletterSubscriber.update({
      where: { token },
      data: { isActive: false },
    });
  }

  async getMySubscription(email: string) {
    if (!email) return { subscribed: false };
    const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
    return { subscribed: sub ? sub.isActive : true };
  }

  async unsubscribeMe(email: string) {
    if (!email) throw new BadRequestException('ایمیل یافت نشد.');
    return this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: false },
      create: { email, isActive: false },
    });
  }

  async resubscribeMe(email: string) {
    if (!email) throw new BadRequestException('ایمیل یافت نشد.');
    return this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, isActive: true },
    });
  }

  async getSubscribers(onlyActive = true) {
    const [users, subscriberRows] = await Promise.all([
      this.prisma.user.findMany({
        where: { isActive: true, email: { not: null } },
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: { select: { firstName: true } },
        },
      }),
      this.prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const rowByEmail = new Map(subscriberRows.map((row) => [row.email, row]));

    const userEntries = users
      .filter((u) => !!u.email)
      .map((u) => {
        const row = rowByEmail.get(u.email!);
        return {
          id: row ? row.id : `user-${u.id}`,
          email: u.email!,
          name: row?.name ?? u.profile?.firstName ?? null,
          isActive: row ? row.isActive : true,
          createdAt: row ? row.createdAt : u.createdAt,
          token: row?.token ?? null,
          source: 'user' as const,
        };
      });

    const guestEntries = subscriberRows
      .filter((row) => !users.some((u) => u.email === row.email))
      .map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        isActive: row.isActive,
        createdAt: row.createdAt,
        token: row.token,
        source: 'guest' as const,
      }));

    const all = [...userEntries, ...guestEntries].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return onlyActive ? all.filter((s) => s.isActive) : all;
  }

  async deleteSubscriber(id: string) {
    if (id.startsWith('user-')) {
      const userId = id.replace('user-', '');
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (!user?.email) throw new NotFoundException('کاربر یافت نشد.');

      return this.prisma.newsletterSubscriber.upsert({
        where: { email: user.email },
        update: { isActive: false },
        create: { email: user.email, isActive: false },
      });
    }

    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('مشترک یافت نشد.');

    return this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCampaigns() {
    return this.prisma.newsletterCampaign.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async sendCampaign(dto: SendCampaignDto) {
    const subscribers = await this.getSubscribers(true);
    if (!subscribers.length) throw new BadRequestException('هیچ مشترک فعالی وجود ندارد.');

    const frontendUrl = this.config.get<string>('app.frontendUrl');
    let successCount = 0;

    await Promise.allSettled(
      subscribers.map(async (sub) => {
        const unsubLink =
          sub.source === 'guest' && sub.token
            ? `${frontendUrl}/unsubscribe?token=${sub.token}`
            : `${frontendUrl}/profile`;
        const html = `
          ${dto.body}
          <hr style="margin-top:32px"/>
          <p style="font-size:12px;color:#888">
          </p>`;
        const ok = await this.mail.sendMail(sub.email, dto.subject, html);
        if (ok) successCount++;
      }),
    );

    return this.prisma.newsletterCampaign.create({
      data: {
        subject: dto.subject,
        body: dto.body,
        sentAt: new Date(),
        recipientCount: successCount,
      },
    });
  }
}
