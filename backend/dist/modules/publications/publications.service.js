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
exports.PublicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublicationsService = class PublicationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(query) {
        const where = {};
        if (query.category)
            where.category = query.category;
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { summary: { contains: query.search, mode: 'insensitive' } },
                { category: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.publication.findMany({ where, orderBy: { year: 'desc' } });
    }
    async findOne(id) {
        const item = await this.prisma.publication.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Publication not found');
        return item;
    }
    async findBySlug(slug) {
        const item = await this.prisma.publication.findUnique({ where: { slug } });
        if (!item)
            throw new common_1.NotFoundException('Publication not found');
        return item;
    }
    async create(dto) {
        const existing = await this.prisma.publication.findUnique({ where: { slug: dto.slug } });
        if (existing)
            throw new common_1.ConflictException('Slug already exists');
        return this.prisma.publication.create({
            data: { ...dto, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.publication.update({
            where: { id },
            data: { ...dto, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.publication.delete({ where: { id } });
        return { message: 'Deleted successfully' };
    }
};
exports.PublicationsService = PublicationsService;
exports.PublicationsService = PublicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicationsService);
//# sourceMappingURL=publications.service.js.map