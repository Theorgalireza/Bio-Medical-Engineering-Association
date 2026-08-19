import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { SubscribeDto, SendCampaignDto } from './dto/newsletter.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class NewsletterService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private config: ConfigService,
    private activityLog: ActivityLogService,
  ) {}

  private logActivity(action: string, detail: string, actorId?: string | null, actorEmail?: string | null, targetId?: string | null, ip?: string | null) {
    return this.activityLog.log({
      actorId, actorEmail, action, targetType: 'Newsletter', targetId: targetId ?? null, detail, ip,
    });
  }

  async subscribe(dto: SubscribeDto, ip?: string | null) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      if (existing.isActive) throw new BadRequestException('این ایمیل قبلاً ثبت شده است.');
      const result = await this.prisma.newsletterSubscriber.update({
        where: { email: dto.email },
        data: { isActive: true, name: dto.name },
      });
      await this.logActivity('SUBSCRIBE_NEWSLETTER', `Reactivated newsletter subscriber ${dto.email}`, null, dto.email, result.id, ip);
      return result;
    }

    const result = await this.prisma.newsletterSubscriber.create({ data: dto });
    await this.logActivity('SUBSCRIBE_NEWSLETTER', `Created newsletter subscriber ${dto.email}`, null, dto.email, result.id, ip);
    return result;
  }

  async unsubscribe(token: string, ip?: string | null) {
    const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { token } });
    if (!sub) throw new NotFoundException('لینک نامعتبر است.');
    const result = await this.prisma.newsletterSubscriber.update({
      where: { token },
      data: { isActive: false },
    });
    await this.logActivity('UNSUBSCRIBE_NEWSLETTER', `Unsubscribed newsletter subscriber ${sub.email}`, null, sub.email, sub.id, ip);
    return result;
  }

  async getMySubscription(email: string) {
    if (!email) return { subscribed: false };
    const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
    return { subscribed: sub ? sub.isActive : false };
  }

  async unsubscribeMe(email: string, ip?: string | null) {
    if (!email) throw new BadRequestException('ایمیل یافت نشد.');
    const result = await this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: false },
      create: { email, isActive: false },
    });
    await this.logActivity('UNSUBSCRIBE_NEWSLETTER', `Unsubscribed newsletter subscriber ${email}`, null, email, result.id, ip);
    return result;
  }

  async resubscribeMe(email: string, ip?: string | null) {
    if (!email) throw new BadRequestException('ایمیل یافت نشد.');
    const result = await this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, isActive: true },
    });
    await this.logActivity('SUBSCRIBE_NEWSLETTER', `Resubscribed newsletter subscriber ${email}`, null, email, result.id, ip);
    return result;
  }

  async getSubscribers(onlyActive = true) {
    const [users, subscriberRows] = await Promise.all([
      this.prisma.user.findMany({
        where: { email: { not: null } },
        select: {
          id: true,
          email: true,
          isActive: true,
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
          isActive: row ? row.isActive : u.isActive,
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

  async deleteSubscriber(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    await this.prisma.deletedRecord.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    if (id.startsWith('user-')) {
      const userId = id.replace('user-', '');
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (!user?.email) throw new NotFoundException('کاربر یافت نشد.');

      const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email: user.email } });
      const trash = await this.prisma.deletedRecord.create({
        data: {
          entityType: 'NewsletterSubscriber',
          entityId: id,
          payload: JSON.parse(JSON.stringify({ userId, email: user.email, existing })),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
      await this.prisma.newsletterSubscriber.upsert({
        where: { email: user.email },
        update: { isActive: false },
        create: { email: user.email, isActive: false },
      });
      await this.logActivity('DELETE_NEWSLETTER_SUBSCRIBER', `Deactivated newsletter subscriber ${user.email}`, actorId, actorEmail, id, ip);
      return { message: 'Deleted successfully', undoToken: trash.token, undoExpiresAt: trash.expiresAt };
    }

    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('مشترک یافت نشد.');

    const trash = await this.prisma.deletedRecord.create({
      data: {
        entityType: 'NewsletterSubscriber',
        entityId: id,
        payload: JSON.parse(JSON.stringify(existing)),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    await this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive: false },
    });
    await this.logActivity('DELETE_NEWSLETTER_SUBSCRIBER', `Deactivated newsletter subscriber ${existing.email}`, actorId, actorEmail, id, ip);
    return { message: 'Deleted successfully', undoToken: trash.token, undoExpiresAt: trash.expiresAt };
  }

  async restoreSubscriber(token: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const trash = await this.prisma.deletedRecord.findUnique({ where: { token } });
    if (!trash || trash.entityType !== 'NewsletterSubscriber' || trash.expiresAt < new Date()) {
      throw new NotFoundException('Undo window expired');
    }
    const payload = trash.payload as any;
    const restored = await this.prisma.$transaction(async (tx) => {
      let result;
      if (payload.userId !== undefined) {
        const previous = payload.existing;
        result = previous
          ? await tx.newsletterSubscriber.upsert({
              where: { email: payload.email },
              update: { name: previous.name, isActive: previous.isActive, token: previous.token },
              create: { ...previous, id: undefined },
            })
          : await tx.newsletterSubscriber.delete({ where: { email: payload.email } }).catch(() => null);
      } else {
        result = await tx.newsletterSubscriber.upsert({
          where: { email: payload.email },
          update: { name: payload.name, isActive: payload.isActive, token: payload.token },
          create: { ...payload, id: undefined },
        });
      }
      await tx.deletedRecord.delete({ where: { id: trash.id } });
      return result;
    });
    await this.logActivity('RESTORE_NEWSLETTER_SUBSCRIBER', `Restored newsletter subscriber ${payload.email}`, actorId, actorEmail, trash.entityId, ip);
    return restored;
  }

  async getCampaigns() {
    return this.prisma.newsletterCampaign.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async sendCampaign(dto: SendCampaignDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
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
            اگر مایل به دریافت ایمیل‌های بعدی نیستید،
            <a href="${unsubLink}" style="color:#2563eb">لغو اشتراک خبرنامه</a>
          </p>`;
        const ok = await this.mail.sendMail(sub.email, dto.subject, html);
        if (ok) successCount++;
      }),
    );

    const campaign = await this.prisma.newsletterCampaign.create({
      data: {
        subject: dto.subject,
        body: dto.body,
        sentAt: new Date(),
        recipientCount: successCount,
      },
    });
    await this.logActivity('SEND_NEWSLETTER_CAMPAIGN', `Sent newsletter campaign '${dto.subject}' to ${successCount} recipients`, actorId, actorEmail, campaign.id, ip);
    return campaign;
  }
}
