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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
let FeedbackService = class FeedbackService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async logActivity(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'Feedback',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
    }
    findAll(query) {
        const where = {};
        if (query.approved !== undefined)
            where.approved = query.approved;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { message: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.feedback.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const item = await this.prisma.feedback.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Feedback not found');
        return item;
    }
    async create(dto, actorId, actorEmail, ip) {
        const referenceCode = `FDB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(0, crypto_1.randomBytes)(3).toString('hex').toUpperCase()}`;
        const item = await this.prisma.feedback.create({ data: { ...dto, referenceCode } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'RECEIVE_FEEDBACK',
            targetId: item.id,
            detail: `Received feedback from ${item.name}`,
            ip,
        });
        return item;
    }
    async update(id, dto, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        const item = await this.prisma.feedback.update({ where: { id }, data: dto });
        if (dto.approved !== undefined && dto.approved !== existing.approved) {
            await this.logActivity({
                actorId,
                actorEmail,
                action: 'UPDATE_FEEDBACK',
                targetId: id,
                detail: `Updated feedback approval status for ${existing.name} to ${dto.approved ? 'approved' : 'unapproved'}`,
                ip,
            });
        }
        return item;
    }
    async remove(id, actorId, actorEmail, ip) {
        const existing = await this.findOne(id);
        await this.prisma.deletedRecord.deleteMany({ where: { expiresAt: { lt: new Date() } } });
        const trash = await this.prisma.deletedRecord.create({
            data: {
                entityType: 'Feedback',
                entityId: id,
                payload: JSON.parse(JSON.stringify(existing)),
                deletedBy: actorId ?? null,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            },
        });
        await this.prisma.feedback.delete({ where: { id } });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'DELETE_FEEDBACK',
            targetId: id,
            detail: `Deleted feedback from ${existing.name}`,
            ip,
        });
        return { message: 'Deleted successfully', undoToken: trash.token, undoExpiresAt: trash.expiresAt };
    }
    async restore(token, actorId, actorEmail, ip) {
        const trash = await this.prisma.deletedRecord.findUnique({ where: { token } });
        if (!trash || trash.entityType !== 'Feedback' || trash.expiresAt < new Date()) {
            throw new common_1.NotFoundException('Undo window expired');
        }
        const payload = trash.payload;
        const restored = await this.prisma.$transaction(async (tx) => {
            const item = await tx.feedback.create({ data: payload });
            await tx.deletedRecord.delete({ where: { id: trash.id } });
            return item;
        });
        await this.logActivity({
            actorId,
            actorEmail,
            action: 'RESTORE_FEEDBACK',
            targetId: restored.id,
            detail: `Restored feedback ${restored.referenceCode}`,
            ip,
        });
        return restored;
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map