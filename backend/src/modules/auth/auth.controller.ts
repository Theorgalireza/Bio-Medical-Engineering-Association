import {
  Controller, Post, Body, Get, Req, Res, UseGuards,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../../common/decorators/public.decorator';
import { GoogleAuthGuard } from '../../common/guards/google-auth.guard';
import { GithubAuthGuard } from '../../common/guards/github-auth.guard';
import { LinkedinAuthGuard } from '../../common/guards/linkedin-auth.guard';
import { ActivityLogService } from '../activity-log/activity-log.service';
class ForgotPasswordDto {
  @IsString()
  identifier!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
    private readonly activityLog: ActivityLogService,
  ) {}

  private setAuthCookie(reply: any, accessToken: string) {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    reply.setCookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  private redirectToFrontend(reply: any, provider: string, accessToken: string) {
    this.setAuthCookie(reply, accessToken);
    const frontendUrl = this.config.get<string>('app.frontendUrl') || 'http://localhost:3000';
    return reply.redirect(`${frontendUrl}/login?provider=${provider}`);
  }

  private logAuthFailure(action: string, detail: string, req: any, actorEmail?: string | null) {
    return this.activityLog.log({
      actorEmail: actorEmail ?? null,
      action,
      targetType: 'User',
      detail,
      ip: req.ip,
    });
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: any, @Res() reply: any) {
    const result = await this.auth.register(dto, null, req.ip);
    this.setAuthCookie(reply, result.access_token);
    return reply.send(result);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: any, @Res() reply: any) {
    try {
      const result = await this.auth.login(dto, null, req.ip);
      this.setAuthCookie(reply, result.access_token);
      return reply.send(result);
    } catch (error) {
      await this.logAuthFailure(
        'LOGIN_FAILED',
        `Failed login attempt using ${dto.email ? 'email' : dto.phone ? 'phone' : 'unknown identifier'}`,
        req,
        dto.email,
      );
      throw error;
    }
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto, @Req() req: any) {
    return this.auth.sendOtp(dto.phone, null, req.ip).catch(async (error) => {
      await this.logAuthFailure('SEND_OTP_FAILED', 'Failed to send OTP', req, null);
      throw error;
    });
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('forgot-password')
  forgot(@Body() dto: ForgotPasswordDto, @Req() req: any) {
    return this.auth.forgotPassword(dto.identifier, null, req.ip).catch(async (error) => {
      await this.logAuthFailure('FORGOT_PASSWORD_FAILED', 'Failed password reset request', req, dto.identifier);
      throw error;
    });
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('reset-password')
  reset(@Body() dto: ResetPasswordDto, @Req() req: any) {
    return this.auth.resetPassword(dto.token, dto.newPassword, null, req.ip).catch(async (error) => {
      await this.logAuthFailure('RESET_PASSWORD_FAILED', 'Failed password reset', req);
      throw error;
    });
  }

  @Public()
  @Post('logout')
  async logout(@Req() req: any, @Res() reply: any) {
    await this.activityLog.log({
      actorId: req.user?.id ?? null,
      actorEmail: req.user?.email ?? null,
      action: 'LOGOUT',
      targetType: 'User',
      targetId: req.user?.id ?? null,
      detail: req.user?.id ? 'User logged out' : 'Anonymous logout request',
      ip: req.ip,
    });
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    reply.clearCookie('access_token', { path: '/', sameSite: 'lax', secure: isProd });
    return reply.send({ success: true });
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: any, @Res() reply: any) {
    if (!req.user) {
      return reply.redirect(
        `${this.config.get<string>('app.frontendUrl') || 'http://localhost:3000'}/login?error=google_auth_failed`,
      );
    }
    const token = await this.auth.oauthLogin(req.user, null, req.ip);
    return this.redirectToFrontend(reply, 'google', token.access_token);
  }

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubAuth() {}

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubCallback(@Req() req: any, @Res() reply: any) {
    if (!req.user) {
      return reply.redirect(
        `${this.config.get<string>('app.frontendUrl') || 'http://localhost:3000'}/login?error=github_auth_failed`,
      );
    }
    const token = await this.auth.oauthLogin(req.user, null, req.ip);
    return this.redirectToFrontend(reply, 'github', token.access_token);
  }

  @Public()
  @UseGuards(LinkedinAuthGuard)
  @Get('linkedin')
  linkedinAuth() {}

  @Public()
  @UseGuards(LinkedinAuthGuard)
  @Get('linkedin/callback')
  async linkedinCallback(@Req() req: any, @Res() reply: any) {
    if (!req.user) {
      return reply.redirect(
        `${this.config.get<string>('app.frontendUrl') || 'http://localhost:3000'}/login?error=linkedin_auth_failed`,
      );
    }
    const token = await this.auth.oauthLogin(req.user, null, req.ip);
    return this.redirectToFrontend(reply, 'linkedin', token.access_token);
  }
}
