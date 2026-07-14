import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SmsService } from './sms/sms.service';
// import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { GoogleAuthGuard } from '../../common/guards/google-auth.guard';
import { GithubAuthGuard } from '../../common/guards/github-auth.guard';
import { LinkedinAuthGuard } from '../../common/guards/linkedin-auth.guard';
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('app.jwtSecret'),
        signOptions: { expiresIn: config.get<string>('app.jwtExpiresIn') },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    SmsService,
    // GoogleStrategy,
    GithubStrategy,
    LinkedinStrategy,
    GoogleAuthGuard,
    GithubAuthGuard,
    LinkedinAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}