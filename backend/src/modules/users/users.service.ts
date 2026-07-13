import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    phone: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    profile: true,
  };

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

  async getProfile(userId: string) {
    return this.findById(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findById(userId);

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: { ...dto },
      create: { userId, ...dto },
    });

    return profile;
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
