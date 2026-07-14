import {
  Controller, Post, Body, Get, Req, Res, UseGuards,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../../common/decorators/public.decorator';
import { GoogleAuthGuard } from '../../common/guards/google-auth.guard';
import { GithubAuthGuard } from '../../common/guards/github-auth.guard';
import { LinkedinAuthGuard } from '../../common/guards/linkedin-auth.guard';
class ForgotPasswordDto {
  @IsString()
  identifier!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private setAuthCookie(reply: any, accessToken: string) {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    reply.setCookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // ۷ روز — باید با انقضای JWT هماهنگ باشد
    });
  }

  private redirectToFrontend(reply: any, provider: string, accessToken: string) {
    this.setAuthCookie(reply, accessToken);
    const frontendUrl = this.config.get<string>('app.frontendUrl') || 'http://localhost:3000';
    return reply.redirect(`${frontendUrl}/login?provider=${provider}`);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() reply: any) {
    const result = await this.auth.register(dto);
    this.setAuthCookie(reply, result.access_token);
    return reply.send(result);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() reply: any) {
    const result = await this.auth.login(dto);
    this.setAuthCookie(reply, result.access_token);
    return reply.send(result);
  }

  @Public()
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.auth.sendOtp(dto.phone);
  }

  @Public()
  @Post('forgot-password')
  forgot(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.identifier);
  }

  @Public()
  @Post('reset-password')
  reset(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }

  @Public()
  @Post('logout')
  logout(@Res() reply: any) {
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
    const token = await this.auth.oauthLogin(req.user);
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
    const token = await this.auth.oauthLogin(req.user);
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
    const token = await this.auth.oauthLogin(req.user);
    return this.redirectToFrontend(reply, 'linkedin', token.access_token);
  }
}
