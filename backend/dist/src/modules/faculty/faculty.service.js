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
exports.FacultyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FacultyService = class FacultyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(query) {
        const where = {};
        if (query.isActive !== undefined)
            where.isActive = query.isActive;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { title: { contains: query.search, mode: 'insensitive' } },
                { monogram: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.facultyMember.findMany({ where, orderBy: { name: 'asc' } });
    }
    async findOne(id) {
        const item = await this.prisma.facultyMember.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Faculty member not found');
        return item;
    }
    create(dto) {
        return this.prisma.facultyMember.create({ data: { ...dto, specialties: dto.specialties } });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.facultyMember.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.facultyMember.delete({ where: { id } });
        return { message: 'Deleted successfully' };
    }
};
exports.FacultyService = FacultyService;
exports.FacultyService = FacultyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FacultyService);
//# sourceMappingURL=faculty.service.js.map