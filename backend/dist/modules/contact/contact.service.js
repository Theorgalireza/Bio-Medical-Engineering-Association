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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
let ContactService = class ContactService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async logActivity(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'ContactMessage',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
    }
    findAll(query) {
        const where = {};
        if (query.read !== undefined)
            where.read = query.read;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { subject: { contains: query.search, mode: 'insensitive' } },
                { message: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.contact.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const item = await this.prisma.contact.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Contact message not found');
        return item;
    }
    async create(dto, actorId, actorEmail, ip) {
        const item = await this.prisma.contact.create({ data: dto });
        await this.logActivity({
            actorId,
            actorEmail: actorEmail ?? dto.email,
            action: 'RECEIVE_CONTACT_MESSAGE',
            targetId: item.id,
            detail: `New contact message from ${dto.email} (${dto.name})`,
            ip,
        });
        return item;
    }
    async update(id, dto, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        const item = await this.prisma.contact.update({ where: { id }, data: dto });
        if (dto.read !== undefined && dto.read !== existing.read) {
            await this.logActivity({
                actorId,
                actorEmail,
                action: 'MARK_CONTACT_READ',
                targetId: id,
                detail: `Marked contact message from ${existing.email} as ${dto.read ? 'read' : 'unread'}`,
                ip,
            });
        }
        return item;
    }
    async remove(id, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        await this.prisma.contact.delete({ where: { id } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'DELETE_CONTACT_MESSAGE',
            targetId: id,
            detail: `Deleted contact message from ${existing.email}`,
            ip,
        });
        return { message: 'Deleted successfully' };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], ContactService);
//# sourceMappingURL=contact.service.js.map