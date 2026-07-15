import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

const profileSelect = {
  id: true,
  userId: true,
  firstName: true,
  lastName: true,
  studentId: true,
  university: true,
  major: true,
  field: true,
  entryYear: true,
  github: true,
  linkedin: true,
  website: true,
  profileEmail: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLog: ActivityLogService,
  ) {}

  private readonly userSelect = {
    id: true,
    email: true,
    phone: true,
    avatarUrl: true,
    isActive: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    profile: { select: profileSelect },
  } as const;

  private normalizeProfileData(dto: Partial<CreateUserDto & UpdateProfileDto>) {
    return {
      firstName: dto.firstName?.trim() || undefined,
      lastName: dto.lastName?.trim() || undefined,
      studentId: dto.studentId?.trim() || undefined,
      university: dto.university?.trim() || undefined,
      major: dto.major?.trim() || undefined,
      field: dto.field?.trim() || undefined,
      entryYear:
        dto.entryYear === null || dto.entryYear === undefined
          ? undefined
          : Number(dto.entryYear),
      github: dto.github?.trim() || undefined,
      linkedin: dto.linkedin?.trim() || undefined,
      website: dto.website?.trim() || undefined,
      profileEmail: dto.profileEmail?.trim() || undefined,
    };
  }

  private hasProfileData(dto: Record<string, unknown>) {
    return Object.values(dto).some((value) => value !== undefined);
  }

  private async upsertProfile(userId: string, dto: Partial<CreateUserDto & UpdateProfileDto>) {
    const profileData = this.normalizeProfileData(dto);

    if (!this.hasProfileData(profileData)) {
      return null;
    }

    return this.prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });
  }

  private async logActivity(params: {
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

  async findAll() {
    return this.prisma.user.findMany({
      select: this.userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    return user;
  }

  async create(dto: CreateUserDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('حداقل ایمیل یا شماره موبایل الزامی است');
    }

    const duplicateWhere = [
      dto.email ? { email: dto.email } : null,
      dto.phone ? { phone: dto.phone } : null,
    ].filter(Boolean) as Prisma.UserWhereInput[];

    if (duplicateWhere.length) {
      const existing = await this.prisma.user.findFirst({
        where: { OR: duplicateWhere },
      });

      if (existing) {
        throw new ConflictException('کاربر با این ایمیل یا شماره موبایل قبلاً ثبت شده است');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const profileData = this.normalizeProfileData(dto);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
        profile: this.hasProfileData(profileData)
          ? {
              create: profileData,
            }
          : undefined,
      },
      select: this.userSelect,
    });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'CREATE_USER',
      targetId: user.id,
      detail: `Created user ${user.email ?? user.phone ?? user.id}`,
      ip,
    });

    return user;
  }

  async getProfile(userId: string) {
    return this.findById(userId);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    actorId?: string | null,
    actorEmail?: string | null,
    ip?: string | null,
  ) {
    await this.findById(userId);
    await this.upsertProfile(userId, dto);
    const user = await this.findById(userId);

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'UPDATE_USER_PROFILE',
      targetId: userId,
      detail: `Updated profile of user ${user.email ?? user.phone ?? userId}`,
      ip,
    });

    return user;
  }

  async updateStatus(
    id: string,
    isActive: boolean,
    actorId?: string | null,
    actorEmail?: string | null,
    ip?: string | null,
  ) {
    const user = await this.findById(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: this.userSelect,
    });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'UPDATE_USER_STATUS',
      targetId: id,
      detail: `Updated status of user ${user.email ?? user.phone ?? id} to ${isActive ? 'ACTIVE' : 'INACTIVE'}`,
      ip,
    });

    return updated;
  }

  async updateRole(
    id: string,
    dto: UpdateUserRoleDto,
    actorId?: string | null,
    actorEmail?: string | null,
    ip?: string | null,
  ) {
    const user = await this.findById(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: this.userSelect,
    });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'UPDATE_USER_ROLE',
      targetId: id,
      detail: `Updated role of user ${user.email ?? user.phone ?? id} to ${dto.role}`,
      ip,
    });

    return updated;
  }

  async remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const user = await this.findById(id);

    await this.prisma.user.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_USER',
      targetId: id,
      detail: `Deleted user ${user.email ?? user.phone ?? id}`,
      ip,
    });

    return { message: 'کاربر با موفقیت حذف شد' };
  }

  async countByRole() {
    const roles = Object.values(Role);
    const counts = await Promise.all(
      roles.map(async (role) => ({
        role,
        count: await this.prisma.user.count({ where: { role } }),
      })),
    );
    return counts;
  }
}
