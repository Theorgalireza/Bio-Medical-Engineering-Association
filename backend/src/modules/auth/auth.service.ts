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
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
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

    return this.signToken(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    if (dto.phone && dto.otp) {
      return this.loginWithOtp(dto.phone, dto.otp);
    }

    if (dto.email && dto.password) {
      return this.loginWithPassword(dto.email, dto.password);
    }

    throw new BadRequestException('Invalid credentials');
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

  async sendOtp(phone: string) {
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

    return { message: 'OTP sent' };
  }

  async forgotPassword(identifier: string) {
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

    return { message: 'If account exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
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

    return { message: 'Password reset successful' };
  }

  async oauthLogin(profile: OAuthProfilePayload): Promise<AuthResult> {
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
