"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const announcements_module_1 = require("./modules/announcements/announcements.module");
const articles_module_1 = require("./modules/articles/articles.module");
const faculty_module_1 = require("./modules/faculty/faculty.module");
const gallery_module_1 = require("./modules/gallery/gallery.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const contact_module_1 = require("./modules/contact/contact.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const csrf_guard_1 = require("./common/guards/csrf.guard");
const config_2 = require("./config/config");
const activity_log_module_1 = require("./modules/activity-log/activity-log.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const site_settings_module_1 = require("./modules/site-settings/site-settings.module");
function toSafePositiveInt(value, fallback) {
    const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [config_2.default] }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const ttl = toSafePositiveInt(config.get('THROTTLE_TTL'), 60000);
                    const limit = toSafePositiveInt(config.get('THROTTLE_LIMIT'), 100);
                    return {
                        throttlers: [
                            {
                                name: 'default',
                                ttl,
                                limit,
                            },
                        ],
                        skipIf: () => process.env.NODE_ENV === 'test' ||
                            process.env.JEST_WORKER_ID !== undefined ||
                            ttl <= 0 ||
                            limit <= 0,
                    };
                },
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty' }
                        : undefined,
                    level: process.env.LOG_LEVEL || 'info',
                },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            announcements_module_1.AnnouncementsModule,
            articles_module_1.ArticlesModule,
            faculty_module_1.FacultyModule,
            gallery_module_1.GalleryModule,
            feedback_module_1.FeedbackModule,
            contact_module_1.ContactModule,
            activity_log_module_1.ActivityLogModule,
            analytics_module_1.AnalyticsModule,
            site_settings_module_1.SiteSettingsModule
        ],
        providers: [
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: transform_interceptor_1.TransformInterceptor },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: csrf_guard_1.CsrfGuard },
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map