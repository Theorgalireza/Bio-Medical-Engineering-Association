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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const slugify_1 = require("slugify");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const sanitize_html_util_1 = require("../../common/utils/sanitize-html.util");
let ArticlesService = class ArticlesService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async logActivity(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'Article',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
    }
    findAll(query) {
        const where = { status: client_1.ContentStatus.PUBLISHED };
        if (query.status)
            where.status = query.status;
        if (query.category)
            where.category = query.category;
        if (query.featured !== undefined)
            where.featured = query.featured;
        if (query.tag)
            where.tags = { some: { tag: { name: query.tag } } };
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { summary: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.article.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { tags: { include: { tag: true } } },
        });
    }
    async findBySlug(slug) {
        const item = await this.prisma.article.findUnique({
            where: { slug },
            include: { tags: { include: { tag: true } } },
        });
        if (!item)
            throw new common_1.NotFoundException('Article not found');
        return item;
    }
    async create(dto, user, actorId, actorEmail, ip) {
        const { tags, ...data } = dto;
        const base = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        const exists = await this.prisma.article.findUnique({ where: { slug: base } });
        const slug = exists ? `${base}-${Date.now()}` : base;
        const status = dto.status ?? client_1.ContentStatus.DRAFT;
        const sanitizedData = {
            ...data,
            content: (0, sanitize_html_util_1.sanitizeRichText)(data.content),
        };
        const article = await this.prisma.article.create({
            data: {
                ...sanitizedData,
                slug,
                authorId: user.id,
                status,
                publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : null,
                tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
            },
            include: { tags: { include: { tag: true } } },
        });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'CREATE_ARTICLE',
            targetId: article.id,
            detail: `Created article '${article.title}' (${article.slug})`,
            ip,
        });
        return article;
    }
    async update(id, dto, actorId, actorEmail, ip) {
        const existing = await this.prisma.article.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Article not found');
        const { tags, ...data } = dto;
        let slug = existing.slug;
        if (dto.title && dto.title !== existing.title) {
            const base = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
            const conflict = await this.prisma.article.findUnique({ where: { slug: base } });
            slug = conflict ? `${base}-${Date.now()}` : base;
        }
        const status = dto.status ?? existing.status;
        if (tags) {
            await this.prisma.articleTag.deleteMany({ where: { articleId: id } });
        }
        const sanitizedData = {
            ...data,
            content: data.content !== undefined ? (0, sanitize_html_util_1.sanitizeRichText)(data.content) : undefined,
        };
        const article = await this.prisma.article.update({
            where: { id },
            data: {
                ...sanitizedData,
                slug,
                publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : existing.publishedAt,
                tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
            },
            include: { tags: { include: { tag: true } } },
        });
        const statusChanged = dto.status !== undefined && dto.status !== existing.status;
        const action = statusChanged
            ? status === client_1.ContentStatus.PUBLISHED
                ? 'PUBLISH_ARTICLE'
                : 'UNPUBLISH_ARTICLE'
            : 'UPDATE_ARTICLE';
        await this.logActivity({
            actorId,
            actorEmail,
            action,
            targetId: article.id,
            detail: `${action === 'UPDATE_ARTICLE' ? 'Updated' : action === 'PUBLISH_ARTICLE' ? 'Published' : 'Unpublished'} article '${article.title}' (${article.slug})`,
            ip,
        });
        return article;
    }
    async remove(id, actorId, actorEmail, ip) {
        const item = await this.prisma.article.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Article not found');
        await this.prisma.article.delete({ where: { id } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'DELETE_ARTICLE',
            targetId: id,
            detail: `Deleted article '${item.title}' (${item.slug})`,
            ip,
        });
        return { message: 'Deleted successfully' };
    }
    async resolveTagConnects(tagNames) {
        return Promise.all(tagNames.map(async (name) => {
            const tag = await this.prisma.tag.upsert({
                where: { name },
                create: { name },
                update: {},
            });
            return { tagId: tag.id };
        }));
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map