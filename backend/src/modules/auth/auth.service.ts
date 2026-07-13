// src/modules/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomInt, randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    if (!dto.email && !dto.phone) throw new BadRequestException('Email or phone required');

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existing) throw new BadRequestException('User already exists');

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
    const user = await this.prisma.user.create({
      data: { email: dto.email, phone: dto.phone, passwordHash },
    });

    return this.signToken(user.id, user.role);
  }

  async login(dto: LoginDto) {
    if (dto.phone && dto.otp) return this.loginWithOtp(dto.phone, dto.otp);
    if (dto.email && dto.password) return this.loginWithPassword(dto.email, dto.password);
    throw new BadRequestException('Invalid credentials');
  }

  private async loginWithPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) throw new UnauthorizedException();
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException();
    return this.signToken(user.id, user.role);
  }

  private async loginWithOtp(phone: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new UnauthorizedException();

    const otp = await this.prisma.otpCode.findFirst({
      where: { userId: user.id, code, used: false, expiresAt: { gt: new Date() } },
    });
    if (!otp) throw new UnauthorizedException('Invalid or expired OTP');

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
    return this.signToken(user.id, user.role);
  }

  async sendOtp(phone: string) {
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) user = await this.prisma.user.create({ data: { phone } });

    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpCode.create({ data: { userId: user.id, code, expiresAt } });

    // TODO: integrate SMS provider
    console.log(`OTP for ${phone}: ${code}`);
    return { message: 'OTP sent' };
  }

  async forgotPassword(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });
    if (!user) return { message: 'If account exists, reset link sent' };

    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    // TODO: send via email/SMS provider
    console.log(`Reset token: ${token}`);
    return { message: 'If account exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.used || record.expiresAt < new Date())
      throw new BadRequestException('Invalid or expired token');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
    await this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } });
    return { message: 'Password reset successful' };
  }

  private signToken(userId: string, role: string) {
    return { access_token: this.jwt.sign({ sub: userId, role }) };
  }
}
