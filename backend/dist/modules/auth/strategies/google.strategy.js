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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(config) {
        super({
            clientID: config.get('app.googleClientId') || '',
            clientSecret: config.get('app.googleClientSecret') || '',
            callbackURL: `${config.get('app.backendUrl') || 'http://localhost:3001'}/api/v1/auth/google/callback`,
            passReqToCallback: false,
        });
    }
    async validate(accessToken, refreshToken, profile) {
        const fullName = profile.displayName || profile._json?.name || '';
        const [firstName, ...rest] = String(fullName).trim().split(' ');
        const lastName = rest.join(' ').trim();
        return {
            provider: 'google',
            providerId: String(profile.id),
            email: profile.emails?.[0]?.value ?? profile._json?.email ?? null,
            firstName: firstName || null,
            lastName: lastName || null,
            avatarUrl: profile.photos?.[0]?.value ?? profile._json?.picture ?? null,
            displayName: fullName || null,
        };
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map