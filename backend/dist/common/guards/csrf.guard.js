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
exports.CsrfGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const skip_csrf_decorator_1 = require("../decorators/skip-csrf.decorator");
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
let CsrfGuard = class CsrfGuard {
    constructor(reflector, httpAdapterHost) {
        this.reflector = reflector;
        this.httpAdapterHost = httpAdapterHost;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const reply = context.switchToHttp().getResponse();
        if (process.env.NODE_ENV === 'test' ||
            process.env.JEST_WORKER_ID !== undefined ||
            SAFE_METHODS.has(String(request.method ?? '').toUpperCase())) {
            return true;
        }
        const skip = this.reflector.getAllAndOverride(skip_csrf_decorator_1.SKIP_CSRF_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skip)
            return true;
        const adapter = this.httpAdapterHost.httpAdapter;
        const fastify = typeof adapter.getInstance === 'function' ? adapter.getInstance() : adapter;
        const csrfProtection = fastify?.csrfProtection;
        if (typeof csrfProtection !== 'function') {
            throw new common_1.ForbiddenException('CSRF protection is unavailable');
        }
        return new Promise((resolve, reject) => {
            csrfProtection(request, reply, (err) => {
                if (err) {
                    reject(new common_1.ForbiddenException('Invalid CSRF token'));
                    return;
                }
                resolve(true);
            });
        });
    }
};
exports.CsrfGuard = CsrfGuard;
exports.CsrfGuard = CsrfGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        core_1.HttpAdapterHost])
], CsrfGuard);
//# sourceMappingURL=csrf.guard.js.map