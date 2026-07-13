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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.userSelect = {
            id: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            profile: true,
        };
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: this.userSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: this.userSelect,
        });
        if (!user) {
            throw new common_1.NotFoundException('کاربر یافت نشد');
        }
        return user;
    }
    async getProfile(userId) {
        return this.findById(userId);
    }
    async updateProfile(userId, dto) {
        await this.findById(userId);
        const profile = await this.prisma.profile.upsert({
            where: { userId },
            update: { ...dto },
            create: { userId, ...dto },
        });
        return profile;
    }
    async updateRole(id, dto) {
        await this.findById(id);
        return this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
            select: this.userSelect,
        });
    }
    async remove(id) {
        await this.findById(id);
        await this.prisma.user.delete({ where: { id } });
        return { message: 'کاربر با موفقیت حذف شد' };
    }
    async countByRole() {
        const roles = Object.values(client_1.Role);
        const counts = await Promise.all(roles.map(async (role) => ({
            role,
            count: await this.prisma.user.count({ where: { role } }),
        })));
        return counts;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map