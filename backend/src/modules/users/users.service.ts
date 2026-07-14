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
  constructor(private readonly prisma: PrismaService) {}

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

  async create(dto: CreateUserDto) {
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

    return user;
  }

  async getProfile(userId: string) {
    return this.findById(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findById(userId);
    await this.upsertProfile(userId, dto);
    return this.findById(userId);
  }

  async updateStatus(id: string, isActive: boolean) {
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: this.userSelect,
    });
  }

  async updateRole(id: string, dto: UpdateUserRoleDto) {
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    await this.findById(id);

    await this.prisma.user.delete({ where: { id } });

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
