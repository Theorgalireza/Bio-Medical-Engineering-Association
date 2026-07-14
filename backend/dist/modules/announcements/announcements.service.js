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
let AnnouncementsService = class AnnouncementsService {
    constructor(prisma) {
        this.prisma = prisma;
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
    async create(dto, user) {
        const base = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        const exists = await this.prisma.announcement.findUnique({ where: { slug: base } });
        const slug = exists ? `${base}-${Date.now()}` : base;
        const status = dto.status ?? client_1.ContentStatus.DRAFT;
        return this.prisma.announcement.create({
            data: { ...dto, slug, authorId: user.id, status, publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : null },
        });
    }
    async update(id, dto) {
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
        return this.prisma.announcement.update({
            where: { id },
            data: { ...dto, slug, publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : existing.publishedAt },
        });
    }
    async remove(id) {
        const item = await this.prisma.announcement.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Announcement not found');
        await this.prisma.announcement.delete({ where: { id } });
        return { message: 'Deleted successfully' };
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map