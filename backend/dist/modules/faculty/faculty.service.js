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
const activity_log_service_1 = require("../activity-log/activity-log.service");
let FacultyService = class FacultyService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async logActivity(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'Faculty',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
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
    async create(dto, actorId, actorEmail, ip) {
        const item = await this.prisma.facultyMember.create({ data: { ...dto, specialties: dto.specialties } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'CREATE_FACULTY',
            targetId: item.id,
            detail: `Created faculty member ${item.name}`,
            ip,
        });
        return item;
    }
    async update(id, dto, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        const item = await this.prisma.facultyMember.update({ where: { id }, data: dto });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'UPDATE_FACULTY',
            targetId: id,
            detail: `Updated faculty member ${existing.name}`,
            ip,
        });
        return item;
    }
    async remove(id, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        await this.prisma.facultyMember.delete({ where: { id } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'DELETE_FACULTY',
            targetId: id,
            detail: `Deleted faculty member ${existing.name}`,
            ip,
        });
        return { message: 'Deleted successfully' };
    }
};
exports.FacultyService = FacultyService;
exports.FacultyService = FacultyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], FacultyService);
//# sourceMappingURL=faculty.service.js.map