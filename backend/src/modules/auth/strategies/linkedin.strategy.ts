import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LinkedInStrategyBase } from 'passport-linkedin-oauth2';
import { OAuthProfilePayload } from './google.strategy';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(LinkedInStrategyBase, 'linkedin') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('app.linkedinClientId') || '',
      clientSecret: config.get<string>('app.linkedinClientSecret') || '',
      callbackURL: `${config.get<string>('app.backendUrl') || 'http://localhost:3001'}/api/v1/auth/linkedin/callback`,
      scope: ['r_liteprofile', 'r_emailaddress'],
      state: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<OAuthProfilePayload> {
    const firstName =
      profile.name?.givenName ||
      profile._json?.localizedFirstName ||
      null;

    const lastName =
      profile.name?.familyName ||
      profile._json?.localizedLastName ||
      null;

    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return {
      provider: 'linkedin',
      providerId: String(profile.id),
      email: profile.emails?.[0]?.value ?? profile._json?.emailAddress ?? null,
      firstName,
      lastName,
      avatarUrl: profile.photos?.[0]?.value ?? null,
      displayName: fullName || null,
    };
  }
}