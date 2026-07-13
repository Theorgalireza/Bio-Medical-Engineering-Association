"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.PORT || '3001'),
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    smsProvider: process.env.SMS_PROVIDER || 'mock',
    smsApiKey: process.env.SMS_API_KEY || '',
    smsSender: process.env.SMS_SENDER || '',
}));
//# sourceMappingURL=config.js.map