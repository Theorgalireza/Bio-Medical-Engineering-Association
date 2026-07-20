"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("./mail.service");
const config_1 = require("@nestjs/config");
let NewsletterService = class NewsletterService {
    constructor(prisma, mail, config) {
        this.prisma = prisma;
        this.mail = mail;
        this.config = config;
    }
    async subscribe(dto) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            if (existing.isActive)
                throw new common_1.BadRequestException('این ایمیل قبلاً ثبت شده است.');
            return this.prisma.newsletterSubscriber.update({
                where: { email: dto.email },
                data: { isActive: true, name: dto.name },
            });
        }
        return this.prisma.newsletterSubscriber.create({ data: dto });
    }
    async unsubscribe(token) {
        const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { token } });
        if (!sub)
            throw new common_1.NotFoundException('لینک نامعتبر است.');
        return this.prisma.newsletterSubscriber.update({
            where: { token },
            data: { isActive: false },
        });
    }
    async getMySubscription(email) {
        if (!email)
            return { subscribed: false };
        const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
        return { subscribed: sub ? sub.isActive : true };
    }
    async unsubscribeMe(email) {
        if (!email)
            throw new common_1.BadRequestException('ایمیل یافت نشد.');
        return this.prisma.newsletterSubscriber.upsert({
            where: { email },
            update: { isActive: false },
            create: { email, isActive: false },
        });
    }
    async resubscribeMe(email) {
        if (!email)
            throw new common_1.BadRequestException('ایمیل یافت نشد.');
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
            const row = rowByEmail.get(u.email);
            return {
                id: row ? row.id : `user-${u.id}`,
                email: u.email,
                name: row?.name ?? u.profile?.firstName ?? null,
                isActive: row ? row.isActive : true,
                createdAt: row ? row.createdAt : u.createdAt,
                token: row?.token ?? null,
                source: 'user',
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
            source: 'guest',
        }));
        const all = [...userEntries, ...guestEntries].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return onlyActive ? all.filter((s) => s.isActive) : all;
    }
    async deleteSubscriber(id) {
        if (id.startsWith('user-')) {
            const userId = id.replace('user-', '');
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });
            if (!user?.email)
                throw new common_1.NotFoundException('کاربر یافت نشد.');
            return this.prisma.newsletterSubscriber.upsert({
                where: { email: user.email },
                update: { isActive: false },
                create: { email: user.email, isActive: false },
            });
        }
        const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('مشترک یافت نشد.');
        return this.prisma.newsletterSubscriber.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getCampaigns() {
        return this.prisma.newsletterCampaign.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async sendCampaign(dto) {
        const subscribers = await this.getSubscribers(true);
        if (!subscribers.length)
            throw new common_1.BadRequestException('هیچ مشترک فعالی وجود ندارد.');
        const frontendUrl = this.config.get('app.frontendUrl');
        let successCount = 0;
        await Promise.allSettled(subscribers.map(async (sub) => {
            const unsubLink = sub.source === 'guest' && sub.token
                ? `${frontendUrl}/unsubscribe?token=${sub.token}`
                : `${frontendUrl}/profile`;
            const html = `
          ${dto.body}
          <hr style="margin-top:32px"/>
          <p style="font-size:12px;color:#888">
          </p>`;
            const ok = await this.mail.sendMail(sub.email, dto.subject, html);
            if (ok)
                successCount++;
        }));
        return this.prisma.newsletterCampaign.create({
            data: {
                subject: dto.subject,
                body: dto.body,
                sentAt: new Date(),
                recipientCount: successCount,
            },
        });
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map