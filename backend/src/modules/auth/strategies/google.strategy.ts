import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
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

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyBase, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('app.googleClientId') || '',
      clientSecret: config.get<string>('app.googleClientSecret') || '',
      callbackURL: `${config.get<string>('app.backendUrl') || 'http://localhost:3001'}/api/v1/auth/google/callback`,
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<OAuthProfilePayload> {
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
}