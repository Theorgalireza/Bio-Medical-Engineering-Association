"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const csrf_controller_1 = require("./csrf.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const sms_service_1 = require("./sms/sms.service");
const github_strategy_1 = require("./strategies/github.strategy");
const linkedin_strategy_1 = require("./strategies/linkedin.strategy");
const google_auth_guard_1 = require("../../common/guards/google-auth.guard");
const github_auth_guard_1 = require("../../common/guards/github-auth.guard");
const linkedin_auth_guard_1 = require("../../common/guards/linkedin-auth.guard");
const activity_log_module_1 = require("../activity-log/activity-log.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            activity_log_module_1.ActivityLogModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('app.jwtSecret'),
                    signOptions: { expiresIn: config.get('app.jwtExpiresIn') },
                }),
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            sms_service_1.SmsService,
            github_strategy_1.GithubStrategy,
            linkedin_strategy_1.LinkedinStrategy,
            google_auth_guard_1.GoogleAuthGuard,
            github_auth_guard_1.GithubAuthGuard,
            linkedin_auth_guard_1.LinkedinAuthGuard,
        ],
        controllers: [auth_controller_1.AuthController, csrf_controller_1.CsrfController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map