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
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const profileSelect = {
    id: true,
    userId: true,
    firstName: true,
    lastName: true,
    studentId: true,
    university: true,
    major: true,
    field: true,
    entryYear: true,
    github: true,
    linkedin: true,
    website: true,
    profileEmail: true,
};
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.userSelect = {
            id: true,
            email: true,
            phone: true,
            avatarUrl: true,
            isActive: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            profile: { select: profileSelect },
        };
    }
    normalizeProfileData(dto) {
        return {
            firstName: dto.firstName?.trim() || undefined,
            lastName: dto.lastName?.trim() || undefined,
            studentId: dto.studentId?.trim() || undefined,
            university: dto.university?.trim() || undefined,
            major: dto.major?.trim() || undefined,
            field: dto.field?.trim() || undefined,
            entryYear: dto.entryYear === null || dto.entryYear === undefined
                ? undefined
                : Number(dto.entryYear),
            github: dto.github?.trim() || undefined,
            linkedin: dto.linkedin?.trim() || undefined,
            website: dto.website?.trim() || undefined,
            profileEmail: dto.profileEmail?.trim() || undefined,
        };
    }
    hasProfileData(dto) {
        return Object.values(dto).some((value) => value !== undefined);
    }
    async upsertProfile(userId, dto) {
        const profileData = this.normalizeProfileData(dto);
        if (!this.hasProfileData(profileData)) {
            return null;
        }
        return this.prisma.profile.upsert({
            where: { userId },
            update: profileData,
            create: { userId, ...profileData },
        });
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
    async create(dto) {
        if (!dto.email && !dto.phone) {
            throw new common_1.BadRequestException('حداقل ایمیل یا شماره موبایل الزامی است');
        }
        const duplicateWhere = [
            dto.email ? { email: dto.email } : null,
            dto.phone ? { phone: dto.phone } : null,
        ].filter(Boolean);
        if (duplicateWhere.length) {
            const existing = await this.prisma.user.findFirst({
                where: { OR: duplicateWhere },
            });
            if (existing) {
                throw new common_1.ConflictException('کاربر با این ایمیل یا شماره موبایل قبلاً ثبت شده است');
            }
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const profileData = this.normalizeProfileData(dto);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                passwordHash,
                role: dto.role,
                profile: this.hasProfileData(profileData)
                    ? {
                        create: profileData,
                    }
                    : undefined,
            },
            select: this.userSelect,
        });
        return user;
    }
    async getProfile(userId) {
        return this.findById(userId);
    }
    async updateProfile(userId, dto) {
        await this.findById(userId);
        await this.upsertProfile(userId, dto);
        return this.findById(userId);
    }
    async updateStatus(id, isActive) {
        await this.findById(id);
        return this.prisma.user.update({
            where: { id },
            data: { isActive },
            select: this.userSelect,
        });
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