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
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ActivityLogService = class ActivityLogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(input) {
        try {
            await this.prisma.activityLog.create({
                data: {
                    actorId: input.actorId ?? null,
                    actorEmail: input.actorEmail ?? null,
                    action: input.action,
                    targetType: input.targetType ?? null,
                    targetId: input.targetId ?? null,
                    detail: input.detail ?? null,
                    ip: input.ip ?? null,
                },
            });
        }
        catch (error) {
            console.error('Failed to write activity log', error);
        }
    }
    async findAll(options = {}) {
        const rawPage = Number(options.page ?? 1);
        const rawLimit = Number(options.limit ?? 20);
        const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
        const limit = Number.isFinite(rawLimit) ? Math.min(200, Math.max(1, rawLimit)) : 20;
        const where = {};
        if (options.action) {
            where.action = options.action;
        }
        if (options.targetType) {
            where.targetType = options.targetType;
        }
        const [total, data] = await this.prisma.$transaction([
            this.prisma.activityLog.count({ where }),
            this.prisma.activityLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map