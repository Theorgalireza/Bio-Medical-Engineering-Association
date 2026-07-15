import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from './sms/sms.service';
import * as bcrypt from 'bcrypt';
import { randomInt, randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';
import { ActivityLogService } from '../activity-log/activity-log.service';

type OAuthProvider = 'google' | 'github' | 'linkedin';

interface OAuthProfilePayload {
  provider: OAuthProvider;
  providerId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  displayName?: string | null;
}

interface AuthResult {
  access_token: string;
  user: {
    id: string;
    email: string | null;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly smsService: SmsService,
    private readonly activityLog: ActivityLogService,
  ) {}

  private async logAuthAction(params: {
    actorId?: string | null;
    actorEmail?: string | null;
    action: string;
    targetId: string;
    detail: string;
    ip?: string | null;
  }) {
    await this.activityLog.log({
      actorId: params.actorId ?? null,
      actorEmail: params.actorEmail ?? null,
      action: params.action,
      targetType: 'User',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

  async register(dto: RegisterDto, actorId?: string | null, ip?: string | null): Promise<AuthResult> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone required');
    }

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
      },
    });

    const result = this.signToken(user);
    await this.logAuthAction({
      actorId,
      actorEmail: null,
      action: 'REGISTER',
      targetId: user.id,
      detail: `Registered user ${user.email ?? user.phone ?? user.id}`,
      ip,
    });
    return result;
  }

  async login(dto: LoginDto, actorId?: string | null, ip?: string | null): Promise<AuthResult> {
    let result: AuthResult;

    if (dto.phone && dto.otp) {
      result = await this.loginWithOtp(dto.phone, dto.otp);
    } else if (dto.email && dto.password) {
      result = await this.loginWithPassword(dto.email, dto.password);
    } else {
      throw new BadRequestException('Invalid credentials');
    }

    await this.logAuthAction({
      actorId,
      actorEmail: result.user.email,
      action: 'LOGIN',
      targetId: result.user.id,
      detail: `User ${result.user.email ?? result.user.id} logged in`,
      ip,
    });

    return result;
  }

  private async loginWithPassword(email: string, password: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) throw new UnauthorizedException();

    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException();

    return this.signToken(user);
  }

  private async loginWithOtp(phone: string, code: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new UnauthorizedException();

    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    const otp = await this.prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return this.signToken(user);
  }

  async sendOtp(phone: string, actorId?: string | null, ip?: string | null) {
    if (!/^09\d{9}$/.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone },
      });
    }

    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpCode.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await this.prisma.otpCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    await this.smsService.sendOtp(phone, code);

    await this.logAuthAction({
      actorId,
      actorEmail: user.email,
      action: 'SEND_OTP',
      targetId: user.id,
      detail: `Sent OTP to ${user.email ?? phone}`,
      ip,
    });

    return { message: 'OTP sent' };
  }

  async forgotPassword(identifier: string, actorId?: string | null, ip?: string | null) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) return { message: 'If account exists, reset link sent' };

    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await this.logAuthAction({
      actorId,
      actorEmail: user.email,
      action: 'FORGOT_PASSWORD',
      targetId: user.id,
      detail: `Requested password reset for ${user.email ?? user.phone ?? user.id}`,
      ip,
    });

    return { message: 'If account exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string, actorId?: string | null, ip?: string | null) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: record.userId } });

    await this.logAuthAction({
      actorId,
      actorEmail: user?.email ?? null,
      action: 'RESET_PASSWORD',
      targetId: record.userId,
      detail: `Reset password for ${user?.email ?? record.userId}`,
      ip,
    });

    return { message: 'Password reset successful' };
  }

  async oauthLogin(profile: OAuthProfilePayload, actorId?: string | null, ip?: string | null): Promise<AuthResult> {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            provider: profile.provider,
            providerId: profile.providerId,
          },
          ...(profile.email ? [{ email: profile.email }] : []),
        ],
      },
      include: {
        profile: true,
      },
    });

    const isNewUser = !user;

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email ?? undefined,
          role: 'GUEST',
          provider: profile.provider,
          providerId: profile.providerId,
          avatarUrl: profile.avatarUrl ?? undefined,
          profile: {
            create: {
              firstName: profile.firstName ?? undefined,
              lastName: profile.lastName ?? undefined,
              profileEmail: profile.email ?? undefined,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } else {
      const userUpdates: Prisma.UserUpdateInput = {};

      if (!user.provider) userUpdates.provider = profile.provider;
      if (!user.providerId) userUpdates.providerId = profile.providerId;
      if (profile.email && !user.email) userUpdates.email = profile.email;
      if (profile.avatarUrl && !user.avatarUrl) userUpdates.avatarUrl = profile.avatarUrl;

      if (Object.keys(userUpdates).length > 0) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: userUpdates,
          include: {
            profile: true,
          },
        });
      }

      if (user.profile) {
        await this.prisma.profile.update({
          where: { userId: user.id },
          data: {
            firstName: profile.firstName ?? undefined,
            lastName: profile.lastName ?? undefined,
            profileEmail: profile.email ?? undefined,
          },
        });
      } else {
        await this.prisma.profile.create({
          data: {
            userId: user.id,
            firstName: profile.firstName ?? undefined,
            lastName: profile.lastName ?? undefined,
            profileEmail: profile.email ?? undefined,
          },
        });
      }
    }

    await this.logAuthAction({
      actorId,
      actorEmail: profile.email ?? user.email ?? null,
      action: isNewUser ? 'OAUTH_REGISTER' : 'OAUTH_LOGIN',
      targetId: user.id,
      detail: `${isNewUser ? 'Registered' : 'Logged in'} with ${profile.provider}`,
      ip,
    });

    return this.signToken(user);
  }

  private signToken(user: { id: string; email: string | null; role: string }): AuthResult {
    return {
      access_token: this.jwt.sign({ sub: user.id, role: user.role }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
