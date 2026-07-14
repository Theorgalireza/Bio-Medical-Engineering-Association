import { ConfigService } from '@nestjs/config';
import { Strategy as GoogleStrategyBase } from 'passport-google-oauth20';
export interface OAuthProfilePayload {
    provider: 'google' | 'github' | 'linkedin';
    providerId: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    displayName?: string | null;
}
declare const GoogleStrategy_base: new (...args: any[]) => GoogleStrategyBase;
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor(config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<OAuthProfilePayload>;
}
export {};
