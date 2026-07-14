import { ConfigService } from '@nestjs/config';
import { Strategy as LinkedInStrategyBase } from 'passport-linkedin-oauth2';
import { OAuthProfilePayload } from './google.strategy';
declare const LinkedinStrategy_base: new (...args: any[]) => LinkedInStrategyBase;
export declare class LinkedinStrategy extends LinkedinStrategy_base {
    constructor(config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<OAuthProfilePayload>;
}
export {};
