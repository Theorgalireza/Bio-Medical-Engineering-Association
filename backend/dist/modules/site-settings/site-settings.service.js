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
exports.SiteSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
let SiteSettingsService = class SiteSettingsService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    findAll() {
        return this.prisma.siteSetting.findMany();
    }
    async upsert(key, value, actorId, actorEmail, ip) {
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
    async bulkUpsert(settings, actorId, actorEmail, ip) {
        const ops = Object.entries(settings).map(([key, value]) => this.prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        }));
        const result = await this.prisma.$transaction(ops);
        await this.activityLog.log({
            actorId, actorEmail, action: 'UPDATE_SITE_SETTINGS', targetType: 'SiteSetting',
            detail: `Updated ${Object.keys(settings).length} site settings`, ip,
        });
        return result;
    }
};
exports.SiteSettingsService = SiteSettingsService;
exports.SiteSettingsService = SiteSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], SiteSettingsService);
//# sourceMappingURL=site-settings.service.js.map