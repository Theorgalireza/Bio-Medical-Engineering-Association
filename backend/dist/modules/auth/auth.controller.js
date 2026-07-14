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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const otp_dto_1 = require("./dto/otp.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const google_auth_guard_1 = require("../../common/guards/google-auth.guard");
const github_auth_guard_1 = require("../../common/guards/github-auth.guard");
const linkedin_auth_guard_1 = require("../../common/guards/linkedin-auth.guard");
class ForgotPasswordDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "identifier", void 0);
let AuthController = class AuthController {
    constructor(auth, config) {
        this.auth = auth;
        this.config = config;
    }
    setAuthCookie(reply, accessToken) {
        const isProd = this.config.get('NODE_ENV') === 'production';
        reply.setCookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
    }
    redirectToFrontend(reply, provider, accessToken) {
        this.setAuthCookie(reply, accessToken);
        const frontendUrl = this.config.get('app.frontendUrl') || 'http://localhost:3000';
        return reply.redirect(`${frontendUrl}/login?provider=${provider}`);
    }
    async register(dto, reply) {
        const result = await this.auth.register(dto);
        this.setAuthCookie(reply, result.access_token);
        return reply.send(result);
    }
    async login(dto, reply) {
        const result = await this.auth.login(dto);
        this.setAuthCookie(reply, result.access_token);
        return reply.send(result);
    }
    sendOtp(dto) {
        return this.auth.sendOtp(dto.phone);
    }
    forgot(dto) {
        return this.auth.forgotPassword(dto.identifier);
    }
    reset(dto) {
        return this.auth.resetPassword(dto.token, dto.newPassword);
    }
    logout(reply) {
        const isProd = this.config.get('NODE_ENV') === 'production';
        reply.clearCookie('access_token', { path: '/', sameSite: 'lax', secure: isProd });
        return reply.send({ success: true });
    }
    googleAuth() { }
    async googleCallback(req, reply) {
        if (!req.user) {
            return reply.redirect(`${this.config.get('app.frontendUrl') || 'http://localhost:3000'}/login?error=google_auth_failed`);
        }
        const token = await this.auth.oauthLogin(req.user);
        return this.redirectToFrontend(reply, 'google', token.access_token);
    }
    githubAuth() { }
    async githubCallback(req, reply) {
        if (!req.user) {
            return reply.redirect(`${this.config.get('app.frontendUrl') || 'http://localhost:3000'}/login?error=github_auth_failed`);
        }
        const token = await this.auth.oauthLogin(req.user);
        return this.redirectToFrontend(reply, 'github', token.access_token);
    }
    linkedinAuth() { }
    async linkedinCallback(req, reply) {
        if (!req.user) {
            return reply.redirect(`${this.config.get('app.frontendUrl') || 'http://localhost:3000'}/login?error=linkedin_auth_failed`);
        }
        const token = await this.auth.oauthLogin(req.user);
        return this.redirectToFrontend(reply, 'linkedin', token.access_token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('send-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgot", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "reset", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, common_1.Get)('google'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(github_auth_guard_1.GithubAuthGuard),
    (0, common_1.Get)('github'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(github_auth_guard_1.GithubAuthGuard),
    (0, common_1.Get)('github/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(linkedin_auth_guard_1.LinkedinAuthGuard),
    (0, common_1.Get)('linkedin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "linkedinAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(linkedin_auth_guard_1.LinkedinAuthGuard),
    (0, common_1.Get)('linkedin/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkedinCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map