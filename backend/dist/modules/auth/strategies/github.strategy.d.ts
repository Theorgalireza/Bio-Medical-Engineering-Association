import { ConfigService } from '@nestjs/config';
import { Strategy as GithubStrategyBase } from 'passport-github2';
import { OAuthProfilePayload } from './google.strategy';
declare const GithubStrategy_base: new (...args: any[]) => GithubStrategyBase;
export declare class GithubStrategy extends GithubStrategy_base {
    constructor(config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<OAuthProfilePayload>;
}
export {};
