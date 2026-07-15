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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const slugify_1 = require("slugify");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const sanitize_html_util_1 = require("../../common/utils/sanitize-html.util");
let AnnouncementsService = class AnnouncementsService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async logActivity(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'Announcement',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
    }
    findAll(query) {
        const where = { status: client_1.ContentStatus.PUBLISHED };
        if (query.status)
            where.status = query.status;
        if (query.type)
            where.type = query.type;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.announcement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
        });
    }
    async findBySlug(slug) {
        const item = await this.prisma.announcement.findUnique({ where: { slug } });
        if (!item)
            throw new common_1.NotFoundException('Announcement not found');
        return item;
    }
    async create(dto, user, actorId, actorEmail, ip) {
        const base = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        const exists = await this.prisma.announcement.findUnique({ where: { slug: base } });
        const slug = exists ? `${base}-${Date.now()}` : base;
        const status = dto.status ?? client_1.ContentStatus.DRAFT;
        const sanitizedData = {
            ...dto,
            description: (0, sanitize_html_util_1.sanitizeRichText)(dto.description),
        };
        const announcement = await this.prisma.announcement.create({
            data: { ...sanitizedData, slug, authorId: user.id, status, publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : null },
        });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'CREATE_ANNOUNCEMENT',
            targetId: announcement.id,
            detail: `Created announcement '${announcement.title}' (${announcement.slug})`,
            ip,
        });
        return announcement;
    }
    async update(id, dto, actorId, actorEmail, ip) {
        const existing = await this.prisma.announcement.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Announcement not found');
        let slug = existing.slug;
        if (dto.title && dto.title !== existing.title) {
            const base = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
            const conflict = await this.prisma.announcement.findUnique({ where: { slug: base } });
            slug = conflict ? `${base}-${Date.now()}` : base;
        }
        const status = dto.status ?? existing.status;
        const sanitizedData = {
            ...dto,
            description: dto.description !== undefined ? (0, sanitize_html_util_1.sanitizeRichText)(dto.description) : undefined,
        };
        const announcement = await this.prisma.announcement.update({
            where: { id },
            data: { ...sanitizedData, slug, publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : existing.publishedAt },
        });
        const statusChanged = dto.status !== undefined && dto.status !== existing.status;
        const action = statusChanged
            ? status === client_1.ContentStatus.PUBLISHED
                ? 'PUBLISH_ANNOUNCEMENT'
                : 'UNPUBLISH_ANNOUNCEMENT'
            : 'UPDATE_ANNOUNCEMENT';
        await this.logActivity({
            actorId,
            actorEmail,
            action,
            targetId: announcement.id,
            detail: `${action === 'UPDATE_ANNOUNCEMENT' ? 'Updated' : action === 'PUBLISH_ANNOUNCEMENT' ? 'Published' : 'Unpublished'} announcement '${announcement.title}' (${announcement.slug})`,
            ip,
        });
        return announcement;
    }
    async remove(id, actorId, actorEmail, ip) {
        const item = await this.prisma.announcement.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Announcement not found');
        await this.prisma.announcement.delete({ where: { id } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'DELETE_ANNOUNCEMENT',
            targetId: id,
            detail: `Deleted announcement '${item.title}' (${item.slug})`,
            ip,
        });
        return { message: 'Deleted successfully' };
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map