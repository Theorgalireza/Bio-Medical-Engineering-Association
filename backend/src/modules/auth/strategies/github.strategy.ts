import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GithubStrategyBase } from 'passport-github2';
import { OAuthProfilePayload } from './google.strategy';

@Injectable()
export class GithubStrategy extends PassportStrategy(GithubStrategyBase, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('app.githubClientId') || '',
      clientSecret: config.get<string>('app.githubClientSecret') || '',
      callbackURL: `${config.get<string>('app.backendUrl') || 'http://localhost:3001'}/api/v1/auth/github/callback`,
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<OAuthProfilePayload> {
    const fullName = profile.displayName || profile._json?.name || '';
    const [firstName, ...rest] = String(fullName).trim().split(' ');
    const lastName = rest.join(' ').trim();

    return {
      provider: 'github',
      providerId: String(profile.id),
      email: profile.emails?.[0]?.value ?? profile._json?.email ?? null,
      firstName: firstName || null,
      lastName: lastName || null,
      avatarUrl: profile.photos?.[0]?.value ?? profile._json?.avatar_url ?? null,
      displayName: fullName || null,
    };
  }
}