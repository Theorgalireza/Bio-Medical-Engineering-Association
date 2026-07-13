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
let ArticlesService = class ArticlesService {
    constructor(prisma) {
        this.prisma = prisma;
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
    async create(dto, user) {
        const { tags, ...data } = dto;
        const base = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        const exists = await this.prisma.article.findUnique({ where: { slug: base } });
        const slug = exists ? `${base}-${Date.now()}` : base;
        const status = dto.status ?? client_1.ContentStatus.DRAFT;
        return this.prisma.article.create({
            data: {
                ...data,
                slug,
                authorId: user.id,
                status,
                publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : null,
                tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
            },
            include: { tags: { include: { tag: true } } },
        });
    }
    async update(id, dto) {
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
        return this.prisma.article.update({
            where: { id },
            data: {
                ...data,
                slug,
                publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : existing.publishedAt,
                tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
            },
            include: { tags: { include: { tag: true } } },
        });
    }
    async remove(id) {
        const item = await this.prisma.article.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Article not found');
        await this.prisma.article.delete({ where: { id } });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map