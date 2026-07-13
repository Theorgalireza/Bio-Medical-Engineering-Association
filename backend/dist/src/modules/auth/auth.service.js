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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        if (!dto.email && !dto.phone)
            throw new common_1.BadRequestException('Email or phone required');
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
        });
        if (existing)
            throw new common_1.BadRequestException('User already exists');
        const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
        const user = await this.prisma.user.create({
            data: { email: dto.email, phone: dto.phone, passwordHash },
        });
        return this.signToken(user.id, user.role);
    }
    async login(dto) {
        if (dto.phone && dto.otp)
            return this.loginWithOtp(dto.phone, dto.otp);
        if (dto.email && dto.password)
            return this.loginWithPassword(dto.email, dto.password);
        throw new common_1.BadRequestException('Invalid credentials');
    }
    async loginWithPassword(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash)
            throw new common_1.UnauthorizedException();
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException();
        return this.signToken(user.id, user.role);
    }
    async loginWithOtp(phone, code) {
        const user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user)
            throw new common_1.UnauthorizedException();
        const otp = await this.prisma.otpCode.findFirst({
            where: { userId: user.id, code, used: false, expiresAt: { gt: new Date() } },
        });
        if (!otp)
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        await this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
        return this.signToken(user.id, user.role);
    }
    async sendOtp(phone) {
        let user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user)
            user = await this.prisma.user.create({ data: { phone } });
        const code = (0, crypto_1.randomInt)(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.otpCode.create({ data: { userId: user.id, code, expiresAt } });
        console.log(`OTP for ${phone}: ${code}`);
        return { message: 'OTP sent' };
    }
    async forgotPassword(identifier) {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { phone: identifier }] },
        });
        if (!user)
            return { message: 'If account exists, reset link sent' };
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
        });
        console.log(`Reset token: ${token}`);
        return { message: 'If account exists, reset link sent' };
    }
    async resetPassword(token, newPassword) {
        const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
        if (!record || record.used || record.expiresAt < new Date())
            throw new common_1.BadRequestException('Invalid or expired token');
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
        await this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } });
        return { message: 'Password reset successful' };
    }
    signToken(userId, role) {
        return { access_token: this.jwt.sign({ sub: userId, role }) };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map