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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const newsletter_service_1 = require("./newsletter.service");
const newsletter_dto_1 = require("./dto/newsletter.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const skip_csrf_decorator_1 = require("../../common/decorators/skip-csrf.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let NewsletterController = class NewsletterController {
    constructor(service) {
        this.service = service;
    }
    subscribe(dto) {
        return this.service.subscribe(dto);
    }
    unsubscribe(token) {
        return this.service.unsubscribe(token);
    }
    getMySubscription(req) {
        return this.service.getMySubscription(req.user?.email);
    }
    unsubscribeMe(req) {
        return this.service.unsubscribeMe(req.user?.email);
    }
    resubscribeMe(req) {
        return this.service.resubscribeMe(req.user?.email);
    }
    getSubscribers(all) {
        return this.service.getSubscribers(all !== 'true');
    }
    deleteSubscriber(id) {
        return this.service.deleteSubscriber(id);
    }
    getCampaigns() {
        return this.service.getCampaigns();
    }
    sendCampaign(dto) {
        return this.service.sendCampaign(dto);
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, skip_csrf_decorator_1.SkipCsrf)(),
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.SubscribeDto]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, skip_csrf_decorator_1.SkipCsrf)(),
    (0, common_1.Post)('unsubscribe'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-subscription'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "getMySubscription", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('unsubscribe-me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "unsubscribeMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('resubscribe-me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "resubscribeMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OWNER),
    (0, common_1.Get)('subscribers'),
    __param(0, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "getSubscribers", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OWNER),
    (0, common_1.Delete)('subscribers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "deleteSubscriber", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OWNER),
    (0, common_1.Get)('campaigns'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "getCampaigns", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OWNER),
    (0, common_1.Post)('campaigns/send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.SendCampaignDto]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "sendCampaign", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map