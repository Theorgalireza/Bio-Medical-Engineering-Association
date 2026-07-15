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
const sms_service_1 = require("./sms/sms.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const activity_log_service_1 = require("../activity-log/activity-log.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, smsService, activityLog) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.smsService = smsService;
        this.activityLog = activityLog;
    }
    async logAuthAction(params) {
        await this.activityLog.log({
            actorId: params.actorId ?? null,
            actorEmail: params.actorEmail ?? null,
            action: params.action,
            targetType: 'User',
            targetId: params.targetId,
            detail: params.detail,
            ip: params.ip ?? null,
        });
    }
    async register(dto, actorId, ip) {
        if (!dto.email && !dto.phone) {
            throw new common_1.BadRequestException('Email or phone required');
        }
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
        });
        if (existing) {
            throw new common_1.BadRequestException('User already exists');
        }
        const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                passwordHash,
            },
        });
        const result = this.signToken(user);
        await this.logAuthAction({
            actorId,
            actorEmail: null,
            action: 'REGISTER',
            targetId: user.id,
            detail: `Registered user ${user.email ?? user.phone ?? user.id}`,
            ip,
        });
        return result;
    }
    async login(dto, actorId, ip) {
        let result;
        if (dto.phone && dto.otp) {
            result = await this.loginWithOtp(dto.phone, dto.otp);
        }
        else if (dto.email && dto.password) {
            result = await this.loginWithPassword(dto.email, dto.password);
        }
        else {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        await this.logAuthAction({
            actorId,
            actorEmail: result.user.email,
            action: 'LOGIN',
            targetId: result.user.id,
            detail: `User ${result.user.email ?? result.user.id} logged in`,
            ip,
        });
        return result;
    }
    async loginWithPassword(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash)
            throw new common_1.UnauthorizedException();
        if (!user.isActive)
            throw new common_1.UnauthorizedException('User is inactive');
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException();
        return this.signToken(user);
    }
    async loginWithOtp(phone, code) {
        const user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user)
            throw new common_1.UnauthorizedException();
        if (!user.isActive)
            throw new common_1.UnauthorizedException('User is inactive');
        const otp = await this.prisma.otpCode.findFirst({
            where: {
                userId: user.id,
                code,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otp) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        await this.prisma.otpCode.update({
            where: { id: otp.id },
            data: { used: true },
        });
        return this.signToken(user);
    }
    async sendOtp(phone, actorId, ip) {
        if (!/^09\d{9}$/.test(phone)) {
            throw new common_1.BadRequestException('Invalid phone number');
        }
        let user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
            user = await this.prisma.user.create({
                data: { phone },
            });
        }
        const code = (0, crypto_1.randomInt)(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.otpCode.deleteMany({
            where: {
                userId: user.id,
            },
        });
        await this.prisma.otpCode.create({
            data: {
                userId: user.id,
                code,
                expiresAt,
            },
        });
        await this.smsService.sendOtp(phone, code);
        await this.logAuthAction({
            actorId,
            actorEmail: user.email,
            action: 'SEND_OTP',
            targetId: user.id,
            detail: `Sent OTP to ${user.email ?? phone}`,
            ip,
        });
        return { message: 'OTP sent' };
    }
    async forgotPassword(identifier, actorId, ip) {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { phone: identifier }] },
        });
        if (!user)
            return { message: 'If account exists, reset link sent' };
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
        });
        await this.logAuthAction({
            actorId,
            actorEmail: user.email,
            action: 'FORGOT_PASSWORD',
            targetId: user.id,
            detail: `Requested password reset for ${user.email ?? user.phone ?? user.id}`,
            ip,
        });
        return { message: 'If account exists, reset link sent' };
    }
    async resetPassword(token, newPassword, actorId, ip) {
        const record = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!record || record.used || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: record.userId },
            data: { passwordHash },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: record.id },
            data: { used: true },
        });
        const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
        await this.logAuthAction({
            actorId,
            actorEmail: user?.email ?? null,
            action: 'RESET_PASSWORD',
            targetId: record.userId,
            detail: `Reset password for ${user?.email ?? record.userId}`,
            ip,
        });
        return { message: 'Password reset successful' };
    }
    async oauthLogin(profile, actorId, ip) {
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        provider: profile.provider,
                        providerId: profile.providerId,
                    },
                    ...(profile.email ? [{ email: profile.email }] : []),
                ],
            },
            include: {
                profile: true,
            },
        });
        const isNewUser = !user;
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.email ?? undefined,
                    role: 'GUEST',
                    provider: profile.provider,
                    providerId: profile.providerId,
                    avatarUrl: profile.avatarUrl ?? undefined,
                    profile: {
                        create: {
                            firstName: profile.firstName ?? undefined,
                            lastName: profile.lastName ?? undefined,
                            profileEmail: profile.email ?? undefined,
                        },
                    },
                },
                include: {
                    profile: true,
                },
            });
        }
        else {
            const userUpdates = {};
            if (!user.provider)
                userUpdates.provider = profile.provider;
            if (!user.providerId)
                userUpdates.providerId = profile.providerId;
            if (profile.email && !user.email)
                userUpdates.email = profile.email;
            if (profile.avatarUrl && !user.avatarUrl)
                userUpdates.avatarUrl = profile.avatarUrl;
            if (Object.keys(userUpdates).length > 0) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: userUpdates,
                    include: {
                        profile: true,
                    },
                });
            }
            if (user.profile) {
                await this.prisma.profile.update({
                    where: { userId: user.id },
                    data: {
                        firstName: profile.firstName ?? undefined,
                        lastName: profile.lastName ?? undefined,
                        profileEmail: profile.email ?? undefined,
                    },
                });
            }
            else {
                await this.prisma.profile.create({
                    data: {
                        userId: user.id,
                        firstName: profile.firstName ?? undefined,
                        lastName: profile.lastName ?? undefined,
                        profileEmail: profile.email ?? undefined,
                    },
                });
            }
        }
        await this.logAuthAction({
            actorId,
            actorEmail: profile.email ?? user.email ?? null,
            action: isNewUser ? 'OAUTH_REGISTER' : 'OAUTH_LOGIN',
            targetId: user.id,
            detail: `${isNewUser ? 'Registered' : 'Logged in'} with ${profile.provider}`,
            ip,
        });
        return this.signToken(user);
    }
    signToken(user) {
        return {
            access_token: this.jwt.sign({ sub: user.id, role: user.role }),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        sms_service_1.SmsService,
        activity_log_service_1.ActivityLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map