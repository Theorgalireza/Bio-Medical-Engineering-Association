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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
let GalleryService = class GalleryService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async logActivity(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'GalleryItem',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
    }
    findAll(query) {
        const where = {};
        if (query.category)
            where.category = query.category;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.galleryItem.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { uploadedBy: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
        });
    }
    async findOne(id) {
        const item = await this.prisma.galleryItem.findUnique({
            where: { id },
            include: { uploadedBy: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
        });
        if (!item)
            throw new common_1.NotFoundException('Gallery item not found');
        return item;
    }
    async create(dto, uploadedById, actorId, actorEmail, ip) {
        const item = await this.prisma.galleryItem.create({ data: { ...dto, uploadedById } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'CREATE_GALLERY_ITEM',
            targetId: item.id,
            detail: `Created gallery item '${item.title}'`,
            ip,
        });
        return item;
    }
    async update(id, dto, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        const item = await this.prisma.galleryItem.update({ where: { id }, data: dto });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'UPDATE_GALLERY_ITEM',
            targetId: id,
            detail: `Updated gallery item '${existing.title}'`,
            ip,
        });
        return item;
    }
    async remove(id, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        await this.prisma.galleryItem.delete({ where: { id } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'DELETE_GALLERY_ITEM',
            targetId: id,
            detail: `Deleted gallery item '${existing.title}'`,
            ip,
        });
        return { message: 'Deleted successfully' };
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map