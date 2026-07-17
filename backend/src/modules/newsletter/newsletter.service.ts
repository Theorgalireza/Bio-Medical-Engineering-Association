// backend/src/modules/newsletter/newsletter.service.ts
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

  async getSubscribers(onlyActive = true) {
    return this.prisma.newsletterSubscriber.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteSubscriber(id: string) {
    return this.prisma.newsletterSubscriber.delete({ where: { id } });
  }

  async getCampaigns() {
    return this.prisma.newsletterCampaign.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async sendCampaign(dto: SendCampaignDto) {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
    });
    if (!subscribers.length) throw new BadRequestException('هیچ مشترک فعالی وجود ندارد.');

    const frontendUrl = this.config.get<string>('app.frontendUrl');
    let successCount = 0;

    await Promise.allSettled(
      subscribers.map(async (sub) => {
        const unsubLink = `${frontendUrl}/unsubscribe?token=${sub.token}`;
        const html = `
          ${dto.body}
          <hr style="margin-top:32px"/>
          <p style="font-size:12px;color:#888">
            برای لغو اشتراک <a href="${unsubLink}">اینجا کلیک کنید</a>.
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
