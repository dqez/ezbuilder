import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID:
        configService.get<string>('google.clientId') || 'dummy-client-id',
      clientSecret:
        configService.get<string>('google.clientSecret') ||
        'dummy-client-secret',
      callbackURL:
        configService.get<string>('google.callbackUrl') ||
        'http://localhost:3001/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails?.[0]?.value,
      name: name
        ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
        : '',
      avatarUrl: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
