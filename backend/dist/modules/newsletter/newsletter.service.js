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
    async getSubscribers(onlyActive = true) {
        return this.prisma.newsletterSubscriber.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteSubscriber(id) {
        return this.prisma.newsletterSubscriber.delete({ where: { id } });
    }
    async getCampaigns() {
        return this.prisma.newsletterCampaign.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async sendCampaign(dto) {
        const subscribers = await this.prisma.newsletterSubscriber.findMany({
            where: { isActive: true },
        });
        if (!subscribers.length)
            throw new common_1.BadRequestException('هیچ مشترک فعالی وجود ندارد.');
        const frontendUrl = this.config.get('app.frontendUrl');
        let successCount = 0;
        await Promise.allSettled(subscribers.map(async (sub) => {
            const unsubLink = `${frontendUrl}/unsubscribe?token=${sub.token}`;
            const html = `
          ${dto.body}
          <hr style="margin-top:32px"/>
          <p style="font-size:12px;color:#888">
            برای لغو اشتراک <a href="${unsubLink}">اینجا کلیک کنید</a>.
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